import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Body,
  InternalServerErrorException,
  Query,
  Get,
  BadRequestException,
  UnauthorizedException,
  Req,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';
import { AuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Cấu hình chung cho Cookie Access Token (ngắn hạn)
  private getAccessTokenCookieOptions() {
    return {
      httpOnly: true, // Tốt nhất là true để tránh XSS. Nếu Client Component cần đọc JS thì để false (không khuyến khích)
      secure: false, // Để true nếu chạy https (production)
      sameSite: 'lax' as const,
      maxAge: 15 * 60 * 1000, // Ví dụ: 15 phút (khớp với thời gian hết hạn của accessToken)
    };
  }

  // Cấu hình chung cho Cookie Refresh Token (dài hạn)
  private getRefreshTokenCookieOptions() {
    return {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  async handleEmailAuthentication(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.authenticateOrRegister(
      dto.email,
      dto.password,
      dto.name || '',
    );

    if (result.action === 'LOGIN_SUCCESS') {
      res.cookie(
        'refresh_token',
        result.refreshToken,
        this.getRefreshTokenCookieOptions(),
      );

      res.cookie(
        'access_token',
        result.accessToken,
        this.getAccessTokenCookieOptions(),
      );

      return {
        accessToken: result.accessToken,
        user: result.user,
        action: result.action, // LOGIN_SUCCESS
      };
    } else if (result.action === 'VERIFY_REQUIRED') {
      return {
        message: result.message,
        email: result.email,
        action: result.action, // VERIFY_REQUIRED
      };
    } else {
      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình xác thực.',
      );
    }
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      throw new BadRequestException('Mã xác thực bị thiếu.');
    }

    try {
      // 1. Xác minh Token và cập nhật DB
      const verificationResult = await this.authService.verifyEmailToken(token);

      // 2. Set Refresh Token vào HttpOnly Cookie
      res.cookie(
        'refresh_token',
        verificationResult.tokens.refreshToken,
        this.getRefreshTokenCookieOptions(),
      );

      // 2.1. Set access token
      res.cookie(
        'access_token',
        verificationResult.tokens.accessToken,
        this.getAccessTokenCookieOptions(),
      );

      // 3. Trả về trang chủ/stream của Frontend và đính kèm Access Token
      // SỬ DỤNG FE_URL: Chuyển hướng trình duyệt
      const feUrl = this.configService.get('FE_URL') || 'http://localhost:3000';

      // Chuyển hướng về trang chủ
      return res.redirect(`${feUrl}/home`);
    } catch (e) {
      const feUrl = this.configService.get('FE_URL') || 'http://localhost:3000';

      const errorMessage =
        e instanceof Error
          ? e.message
          : 'Đã xảy ra lỗi xác thực không xác định.';

      const encodedMessage = encodeURIComponent(errorMessage);

      return res.redirect(
        `${feUrl}/verification/error?message=${encodedMessage}`,
      );
    }
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK) // 1. Set mã 200 OK
  async resendVerification(
    @Body('email') email: string, // 2. Nhận 'email' từ body
  ) {
    if (!email) {
      throw new BadRequestException('Email là bắt buộc.');
    }

    // 3. Gọi hàm mới trong Service (sẽ tạo ở bước 2)
    await this.authService.resendVerificationLink(email);

    // 4. Luôn trả về thông báo này, kể cả khi email không tồn tại
    // (để ngăn chặn việc dò email)
    return {
      message:
        'Nếu email này được đăng ký và chưa xác thực, một link mới đã được gửi.',
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request, // Dùng @Req() để đọc cookie
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    // 1. Lấy refresh token từ cookie
    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy refresh token.');
    }

    try {
      // 2. Gọi service để xác thực refresh token và cấp token mới
      const result = await this.authService.refreshTokens(refreshToken);

      // 3. (QUAN TRỌNG) Set lại refresh token mới (nếu bạn dùng xoay vòng)
      res.cookie(
        'refresh_token',
        result.tokens.refreshToken,
        this.getRefreshTokenCookieOptions(),
      );

      res.cookie(
        'access_token',
        result.tokens.accessToken,
        this.getAccessTokenCookieOptions(),
      );

      // 4. Trả về accessToken và user cho FE
      return {
        accessToken: result.tokens.accessToken,
        user: result.user,
      };
    } catch (e) {
      // Nếu refresh token không hợp lệ -> Xóa cookie
      res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'lax' });
      res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn.',
      );
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });

    return { message: 'Đã đăng xuất thành công.' };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard sẽ tự động redirect người dùng sang trang đăng nhập Google.
  }

  /**
   * 2. ENDPOINT CALLBACK (Google sẽ gọi về đây)
   */
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google')) // 2. Kích hoạt GoogleStrategy để xử lý callback
  async googleAuthRedirect(
    @Req() req, // 3. Passport đã chạy validate() và gắn 'user' vào req
    @Res({ passthrough: true }) res: Response,
  ) {
    const feUrl = this.configService.get('FE_URL') || 'http://localhost:3000';

    try {
      const user = req.user as any;
      const tokens = await this.authService.login(user);

      res.cookie(
        'refresh_token',
        tokens.refreshToken,
        this.getRefreshTokenCookieOptions(),
      );
      res.cookie(
        'access_token',
        tokens.accessToken,
        this.getAccessTokenCookieOptions(),
      );

      // Chuyển hướng về FE (trang home) với cờ thành công
      res.redirect(`${feUrl}/home`);
    } catch (e) {
      let errorMessage =
        'Tài khoản này đã được tạo bằng mật khẩu. Vui lòng đăng nhập bằng mật khẩu thay vì Google.';

      if (e instanceof ConflictException) {
        errorMessage = e.message;
      }

      const encodedMessage = encodeURIComponent(errorMessage);

      res.redirect(`${feUrl}/?error=${encodedMessage}`);
    }
  }
}

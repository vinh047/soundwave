// src/admin/admin.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Giả định AuthService được Export từ AuthModule
import { LocalAuthGuard } from '../auth/passport/local-auth.guard'; // Giả định đường dẫn này
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Public } from 'src/decorator/customize';
import type { Response } from 'express';

import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

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

  /**
   * API POST /admin/login (UC_LoginAdmin)
   * Sử dụng LocalAuthGuard chung, sau đó kiểm tra Role phải là ADMIN.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // req.user được gán bởi LocalAuthGuard sau khi xác thực Email/Password thành công
    if (req.user.role !== Role.ADMIN) {
      // Kiểm tra role
      throw new UnauthorizedException('Tài khoản không phải Quản trị viên.');
    }

    // Nếu là ADMIN, cấp token
    const result = await this.authService.login(req.user);

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
      user: req.user,
    };
  }

  /**
   * API POST /admin/logout (UC_Logout)
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req) {
    // Gọi hàm logout trong AuthService để xóa Refresh Token
    await this.authService.logout(req.user.id);
    return { message: 'Đăng xuất Admin thành công.' };
  }
}

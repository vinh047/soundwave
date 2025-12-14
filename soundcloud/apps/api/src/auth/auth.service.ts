import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@repo/database';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { EmailService } from 'src/email/email.service';

type AuthResult =
  | {
    action: 'LOGIN_SUCCESS';
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'hashedPassword'>;
  }
  | { action: 'VERIFY_REQUIRED'; message: string; email: string };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) { }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'hashedPassword'> | null> {
    const user = await this.usersService.findOneWithPasswordHashByEmail(email);
    if (!user) return null;
    const isValidPassword = await bcrypt.compare(
      pass,
      user.hashedPassword ?? '',
    );
    if (isValidPassword) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'hashedPassword'>): Promise<any> {
    const payload = { sub: user.id, email: user.email };
    // access token (ngắn hạn)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES') || '15m',
    });

    // refresh token (dài hạn)
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES') || '7d',
    });

    // lưu refresh token vào DB (hash để an toàn)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshTokenHash(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async sendVerification(
    user: User,
  ): Promise<{ email: string; message: string; action: string }> {
    const verificationToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('EMAIL_VERIFY_SECRET'),
        expiresIn: '1h',
      },
    );

    await this.prisma.verificationToken.upsert({
      where: { userId: user.id },
      update: {
        token: verificationToken,
        expires: dayjs().add(1, 'hour').toDate(),
      },
      create: {
        // Nếu chưa tồn tại, TẠO MỚI
        token: verificationToken,
        expires: dayjs().add(1, 'hour').toDate(),
        userId: user.id,
      },
    });

    const apiUrl = this.configService.get('API_URL') || 'http://localhost:8080';

    const verificationLink = `${apiUrl}/auth/verify-email?token=${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name || '',
      verificationLink,
    );

    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra hộp thư email của bạn để xác thực tài khoản.',
      email: user.email,
      action: 'VERIFY_REQUIRED',
    };
  }

  async authenticateOrRegister(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> {
    const existingUser =
      await this.usersService.findOneWithPasswordHashByEmail(email);

    if (existingUser) {
      const userWithoutHash = await this.validateUser(email, password);

      if (!userWithoutHash) {
        throw new UnauthorizedException('Email/Mật khẩu không hợp lệ.');
      }

      if (!existingUser.emailVerified) {
        const verifyResult = await this.sendVerification(existingUser);

        return {
          action: 'VERIFY_REQUIRED',
          message:
            'Tài khoản chưa được kích hoạt. Chúng tôi đã gửi lại link xác thực.',
          email: existingUser.email,
        };
      }

      const { accessToken, refreshToken } = await this.login(userWithoutHash);
      return {
        action: 'LOGIN_SUCCESS',
        accessToken,
        refreshToken,
        user: userWithoutHash,
      };
    } else {
      const newUser = await this.usersService.register(email, password, name);

      const verifyResult = await this.sendVerification(newUser);

      return {
        action: 'VERIFY_REQUIRED',
        message:
          'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
        email: verifyResult.email,
      };
    }
  }
  async verifyEmailToken(token: string) {
    // 1. Giải mã token (để lấy userId)
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('EMAIL_VERIFY_SECRET')!,
      });
    } catch (e) {
      // Lỗi: Token hết hạn, sai chữ ký, hoặc không hợp lệ
      throw new BadRequestException(
        'Mã xác thực không hợp lệ hoặc đã hết hạn.',
      );
    }

    const userId = payload.sub;

    // 2. Tìm Token trong DB (Đảm bảo nó tồn tại và chưa bị sử dụng)
    const verificationRecord = await this.prisma.verificationToken.findUnique({
      where: { token, userId },
      include: { user: true },
    });

    if (!verificationRecord) {
      // Token không tồn tại (đã dùng hoặc không hợp lệ)
      throw new NotFoundException('Mã xác thực không hợp lệ.');
    }

    // 3. Xác thực thành công: Cập nhật User và Xóa Token
    // Cần đảm bảo rằng UsersService có hàm update
    const verifiedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(), // Gán thời gian hiện tại
      },
    });

    // 4. Xóa bản ghi token sau khi sử dụng (để ngăn dùng lại)
    await this.prisma.verificationToken.delete({ where: { token } });

    // 5. Cấp JWT (Đăng nhập tự động)
    const { hashedPassword, ...userWithoutHash } = verifiedUser;
    const tokens = await this.login(userWithoutHash);

    return { user: userWithoutHash, tokens };
  }

  async refreshTokens(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (e) {
      // Lỗi nếu token sai hoặc hết hạn
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn.',
      );
    }

    const userId = payload.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Kiểm tra xem user có tồn tại và có refresh token hash không
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng hoặc token không hợp lệ.',
      );
    }

    // So sánh token từ cookie với hash trong DB
    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isTokenMatch) {
      // Nếu token không khớp (có thể là token cũ đã bị thu hồi)
      throw new UnauthorizedException('Refresh token không hợp lệ.');
    }

    // 3. Tái cấp token mới (Token Rotation)
    const { hashedPassword, ...userWithoutHash } = user;

    const tokens = await this.login(userWithoutHash); // GỌI LẠI HÀM LOGIN

    // Trả về token mới và thông tin user cho controller
    return {
      tokens: tokens, // { accessToken, refreshToken }
      user: userWithoutHash,
    };
  }

  async validateGoogleUser(details: {
    email: string;
    name: string;
    image: string;
  }) {
    // 1. Tìm user bằng email
    const user = await this.prisma.user.findUnique({
      where: { email: details.email },
    });

    // 2. Nếu user đã tồn tại
    if (user) {
      // 2a. KIỂM TRA XUNG ĐỘT:
      // Nếu user này CÓ MẬT KHẨU (nghĩa là đăng ký bằng email/pass)
      if (user.hashedPassword) {
        // Ném lỗi 409 Conflict. Lỗi này sẽ được bắt ở controller.
        throw new ConflictException(
          'Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng mật khẩu.',
        );
      }

      // 2b. Không xung đột (họ đã đăng nhập bằng Google trước đó, hashedPassword là null)
      // -> Trả về user
      const { hashedPassword, ...userWithoutHash } = user;
      return userWithoutHash;
    }

    // 3. Nếu user không tồn tại -> Tạo user mới
    const newUser = await this.prisma.user.create({
      data: {
        email: details.email,
        name: details.name,
        image: details.image,
        emailVerified: new Date(),
      },
    });

    // 4. Trả về user mới
    const { hashedPassword, ...userWithoutHash } = newUser;
    return userWithoutHash;
  }

  async resendVerificationLink(email: string) {
    const user = await this.usersService.findOneWithPasswordHashByEmail(email);

    if (!user) {
      return;
    }

    if (user.emailVerified) {
      return;
    }

    await this.sendVerification(user);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      // 1. Lấy các quan hệ liên kết
      include: {
        profile: {
          include: {
            websiteProfiles: {
              include: { websiteType: true }, // Lấy cả icon/type của link social
            },
          },
        },
        // 2. Đếm số lượng (Stats) để hiển thị trên profile
        _count: {
          select: {
            followers: true,
            following: true,
            tracks: true,
            likes: true,
          },
        },
      },
    });

    if (!user) return null;

    // 3. Loại bỏ thông tin nhạy cảm trước khi trả về
    const { hashedPassword, hashedRefreshToken, ...safeUser } = user;
    return safeUser;
  }

  async logout(userId: string) {
    // Xóa hashedRefreshToken trong DB để invalidate refresh token
    await this.usersService.updateRefreshTokenHash(userId, '');
    return { message: 'Đăng xuất thành công' };
  }
}

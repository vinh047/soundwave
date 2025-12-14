// src/admin/admin.controller.ts
import { Controller, Post, Request, UseGuards, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Giả định AuthService được Export từ AuthModule
import { LocalAuthGuard } from '../auth/passport/local-auth.guard'; // Giả định đường dẫn này
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  /**
   * API POST /admin/login (UC_LoginAdmin)
   * Sử dụng LocalAuthGuard chung, sau đó kiểm tra Role phải là ADMIN.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    // req.user được gán bởi LocalAuthGuard sau khi xác thực Email/Password thành công
    if (req.user.role !== Role.ADMIN) { // Kiểm tra role 
      throw new UnauthorizedException('Tài khoản không phải Quản trị viên.');
    }
    
    // Nếu là ADMIN, cấp token
    return this.authService.login(req.user); 
    // Giả định authService.login() trả về { accessToken, refreshToken }
  }

  /**
   * API POST /admin/logout (UC_Logout)
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    // Gọi hàm logout trong AuthService để xóa Refresh Token
    await this.authService.logout(req.user.id);
    return { message: 'Đăng xuất Admin thành công.' };
  }
}
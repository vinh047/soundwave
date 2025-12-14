// src/admin/guards/admin-roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User object được gán bởi JwtAuthGuard

    if (!user || user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Không có quyền truy cập Quản trị viên (Admin).');
    }

    return true;
  }
}
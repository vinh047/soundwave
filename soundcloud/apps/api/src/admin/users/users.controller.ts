// src/admin/users/users.controller.ts
import { Controller, Get, UseGuards, Query, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard'; 
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * SD Step 2: Yêu cầu danh sách tài khoản
   * API GET /admin/users
   */
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query.page, query.limit);
  }

  /**
   * SD Step 6: Yêu cầu cập nhật trạng thái tài khoản
   * API PATCH /admin/users/:id/status
   */
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
    return this.usersService.updateStatus(id, updateUserStatusDto);
  }
}
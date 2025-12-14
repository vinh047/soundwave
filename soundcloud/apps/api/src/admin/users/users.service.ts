// src/admin/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * SD Step 3: Yêu cầu danh sách tài khoản
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { role: Role.USER }, // Lọc chỉ lấy người dùng thường
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
          profile: { select: { isArtist: true } }, 
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: Role.USER } }),
    ]);

    return { data: users, total, page, limit };
  }

  /**
   * SD Step 7: Yêu cầu cập nhật trạng thái tài khoản
   * LƯU Ý: Chức năng này sẽ BỊ HẠN CHẾ do schema.prisma thiếu trường 'isBanned' trên Model User.
   */
  async updateStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    // Kịch bản Lý tưởng:
    // return this.prisma.user.update({ where: { id }, data: { isBanned: updateUserStatusDto.isBanned } });

    // Kịch bản thực tế (do hạn chế schema):
    throw new NotFoundException(
      `Không thể cập nhật trạng thái người dùng (ID: ${id}). 
      Thiếu trường 'isBanned' trên Model User trong schema.prisma.`,
    );
  }
}
// src/admin/tracks/tracks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTrackStatusDto } from './dto/update-track-status.dto';
import { PaginationDto } from '../users/dto/pagination.dto'; // Tái sử dụng DTO phân trang

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * SD Step 3: Yêu cầu danh sách bài hát (Hệ thống)
   */
  async findAll(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const search = query.search || '';
    const skip = (page - 1) * limit;

    const where = search
      ? { title: { contains: search, mode: 'insensitive' } as any }
      : {};

    const [tracks, total] = await this.prisma.$transaction([
      this.prisma.track.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          isBanned: true, // Trạng thái cấm
          isPublic: true, // Trạng thái công khai
          user: { select: { id: true, email: true, name: true } }, // Chủ sở hữu
          createdAt: true,
          playCount: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.track.count({ where }),
    ]);

    return { data: tracks, total, page, limit };
  }

  /**
   * SD Step 10: Yêu cầu cập nhật trạng thái bài hát (Ẩn/Hiện)
   */
  async updateStatus(id: string, updateTrackStatusDto: UpdateTrackStatusDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Bài hát với ID: ${id} không tồn tại.`);
    }

    // Cập nhật isBanned
    return this.prisma.track.update({
      where: { id },
      data: { isBanned: updateTrackStatusDto.isBanned },
      select: { id: true, title: true, isBanned: true, user: { select: { email: true } } },
    });
  }
}
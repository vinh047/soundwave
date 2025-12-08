import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async search(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    const whereCondition: Prisma.PlaylistWhereInput = {
      isPublic: true,
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { user: { name: { contains: keyword, mode: 'insensitive' } } },
      ],
    };

    const [total, playlists] = await Promise.all([
      this.prisma.playlist.count({ where: whereCondition }),
      this.prisma.playlist.findMany({
        where: whereCondition,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true, // Lấy người tạo

          // Lấy 5 bài hát preview
          tracks: {
            take: 5,
            orderBy: { order: 'asc' },
            include: {
              track: {
                include: { user: true }, // Lấy thông tin bài hát con
              },
            },
          },

          _count: {
            select: {
              tracks: true,
            },
          },
        },
      }),
    ]);

    return {
      data: playlists,
      total,
      page,
      limit,
    };
  }
}

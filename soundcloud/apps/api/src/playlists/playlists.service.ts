import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) { }

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
  async create(userId: string, createPlaylistDto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: {
        ...createPlaylistDto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tracks: true },
        },
        tracks: {
          take: 4,
          orderBy: { order: 'asc' },
          include: {
            track: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: true,
        tracks: {
          orderBy: { order: 'asc' },
          include: {
            track: {
              include: { user: true },
            },
          },
        },
      },
    });
  }

  async update(userId: string, id: string, updatePlaylistDto: UpdatePlaylistDto) {
    // Check ownership
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist || playlist.userId !== userId) {
      throw new Error('Playlist not found or access denied');
    }

    return this.prisma.playlist.update({
      where: { id },
      data: updatePlaylistDto,
    });
  }

  async remove(userId: string, id: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist || playlist.userId !== userId) {
      throw new Error('Playlist not found or access denied');
    }

    return this.prisma.playlist.delete({
      where: { id },
    });
  }

  async addTrack(userId: string, playlistId: string, trackId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { tracks: true },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new Error('Playlist not found or access denied');
    }

    // Check if track already exists
    const exists = playlist.tracks.some((t) => t.trackId === trackId);
    if (exists) {
      throw new Error('Track already in playlist');
    }

    const order = playlist.tracks.length + 1;

    return this.prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
        order,
      },
    });
  }

  async removeTrack(userId: string, playlistId: string, trackId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new Error('Playlist not found or access denied');
    }

    // Find the relation entry
    const relation = await this.prisma.playlistTrack.findUnique({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });

    if (!relation) {
      throw new Error('Track not found in playlist');
    }

    return this.prisma.playlistTrack.delete({
      where: { id: relation.id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Track } from '@repo/database';
import { PaginatedResult } from '../dto/PaginatedResult';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Omit<Track, 'comments' | 'likes'>>> {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    const whereCondition = { isPublic: true, isBanned: false };

    const total = await this.prisma.track.count({
      where: whereCondition,
    });

    const tracks = await this.prisma.track.findMany({
      skip,
      take,
      where: whereCondition,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: tracks as unknown as Track[],
      total,
      page: Math.max(1, page),
      limit: take,
    };
  }

  async create(createTrackDto: CreateTrackDto, userId: string): Promise<Track> {
    const data = { ...createTrackDto, user: { connect: { id: userId } } };
    return await this.prisma.track.create({
      data,
      include: { user: true },
    });
  }

  async findOne(id: string): Promise<Track> {
    try {
      await this.prisma.track.update({
        where: { id },
        data: { playCount: { increment: 1 } },
      });
    } catch {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
      include: { user: true, likes: true, comments: true },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    return track as Track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
    } catch {
      throw new NotFoundException(`Track with ID "${id}" not found to update`);
    }
  }

  async remove(id: string): Promise<Track> {
    try {
      return await this.prisma.track.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Track with ID "${id}" not found to delete`);
    }
  }
}

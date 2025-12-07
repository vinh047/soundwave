import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Playlist, Repost, Track, User } from '@repo/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return newUser as User;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<User>> {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    const total = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip: skip,
      take: take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: users as User[],
      total,
      page: Math.max(1, page),
      limit: take,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tracks: {
          include: { user: true, likes: true, comments: true },
        },
        playlists: {
          include: { tracks: true },
        },
        likes: {
          include: {
            track: {
              include: { user: true },
            },
          },
        },
        reposts: true,
        reports: true,
        comments: true,
        following: {
          include: {
            following: {
              include: {
                _count: {
                  select: { followers: true },
                },
              },
            },
          },
        },
        followers: true,
        profile: {
          include: {
            websiteProfiles: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser as User;
    } catch (error) {
      throw new NotFoundException(`User with ID "${id}" not found`);

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID "${id}" not found`);

      throw error;
    }
  }

  async findOneWithPasswordHashByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneWithNoPassByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRefreshTokenHash(userId: string, hashedRefreshToken: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: { email, hashedPassword, name },
    });
  }
  async findPlaylistsByUser(userId: string): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({
      where: { userId, isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tracks: { take: 1, include: { track: true } },
      },
    });
  }

  async findRepostByUser(userId: string): Promise<Repost[]> {
    return this.prisma.repost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        track: {
          include: { user: true },
        },
      },
    });
  }

  async findPopularTracksByUser(userId: string): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        userId,
        isPublic: true,
        isBanned: false,
      },
      orderBy: {
        playCount: 'desc',
      },
      take: 10,
      include: {
        user: true,
        likes: true,
      },
    });
  }
  async getTrendingArtistsByRecentPlays(limit: number = 10) {
    // Sử dụng $queryRaw để tối ưu hóa hiệu năng cho thống kê phức tạp
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id, 
        u.name, 
        u.image, 
        CAST(COUNT(rl.id) AS INTEGER) as "recentPlays"
      FROM "User" u
      JOIN "Track" t ON t."userId" = u.id
      JOIN "RecentListen" rl ON rl."trackId" = t.id
      WHERE rl."lastPlayedAt" > NOW() - INTERVAL '7 days'
      GROUP BY u.id, u.name, u.image
      ORDER BY "recentPlays" DESC
      LIMIT ${limit};
    `;

    // Map lại dữ liệu nếu cần thiết để khớp với Frontend
    return result.map((artist) => ({
      ...artist,
      // Raw query thường trả về BigInt cho count, cần convert nếu cần
      recentPlays: Number(artist.recentPlays),
    }));
  }

  // --- SOCIAL ---
  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if already following
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) return existing;

    return this.prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    try {
      return await this.prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
    } catch (error) {
      return null;
    }
  }

  async checkFollow(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { isFollowing: !!follow };
  }
}

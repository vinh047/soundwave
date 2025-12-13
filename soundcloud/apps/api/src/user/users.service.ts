import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import type { Playlist, Repost, Track, User } from '@repo/database';

import { Prisma } from '@prisma/client';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

type ArtistProfileResult = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    email: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    profile: {
      include: {
        websiteProfiles: {
          include: {
            websiteType: true;
          };
        };
      };
    };
    tracks: {
      orderBy: { createdAt: 'desc' };
      take: 6;
      include: {
        user: true;
        likes: true;
        reposts: true;
        comments: true;
      };
    };
    playlists: {
      orderBy: { createdAt: 'desc' };
      take: 3;
      select: {
        id: true;
        title: true;
        isPublic: true;
        tracks: { select: { track: { select: { imagePath: true } } } };
      };
    };
    _count: {
      select: {
        tracks: true;
        likes: true;
        comments: true;
        following: true;
        followers: true;
      };
    };
  };
}>;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async getArtistProfileData(id: string): Promise<ArtistProfileResult> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          include: {
            websiteProfiles: {
              include: {
                websiteType: true,
              },
            },
          },
        },

        tracks: {
          where: { isPublic: true, isBanned: false },
          orderBy: { createdAt: 'desc' },
          take: 6,

          include: {
            user: true,
            likes: true,
            reposts: true,
            comments: true,
            _count: {
              select: { likes: true, reposts: true, comments: true },
            },
          },
        },

        playlists: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            title: true,
            isPublic: true,
            tracks: {
              select: {
                track: {
                  select: {
                    imagePath: true,
                    duration: true,
                    playCount: true,
                  },
                },
              },
            },
          },
        },

        _count: {
          select: {
            tracks: true,
            likes: true,
            comments: true,
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user as ArtistProfileResult;
  }

  async getAllTracksByUserId(userId: string): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        userId,
        isPublic: true,
        isBanned: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        likes: true,
        reposts: true,
        _count: {
          select: {
            likes: true,
            reposts: true,
            comments: true,
          },
        },
      },
    });
  }
  async getAllPlaylistsByUserId(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId, isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        tracks: {
          orderBy: { order: 'asc' }, // Sắp xếp bài hát theo thứ tự trong playlist
          take: 1, // Chỉ cần lấy 1 bài để làm ảnh bìa (tối ưu hiệu năng)
          include: {
            track: {
              include: { user: true },
            },
          },
        },
        _count: {
          select: { tracks: true }, // Lấy tổng số bài hát chính xác
        },
      },
    });
  }

  async getAllRepostsByUserId(userId: string) {
    return this.prisma.repost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        track: {
          include: {
            user: true,
            likes: true,
            reposts: true,
            comments: {
              include: { user: true },
            },
            _count: {
              select: {
                likes: true,
                reposts: true,
                comments: true,
              },
            },
          },
        },
      },
    });
  }

  async getFollowersByUserId(
    userId: string,
  ): Promise<Prisma.FollowGetPayload<{ include: { follower: true } }>[]> {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Lấy danh sách Following (user này đang theo dõi ai)
  async getFollowingByUserId(
    userId: string,
  ): Promise<Prisma.FollowGetPayload<{ include: { following: true } }>[]> {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Lấy danh sách Likes (bài hát user này đã thích)
  async getLikesByUserId(userId: string) {
    return this.prisma.like.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        track: {
          // Include đầy đủ để component Interactive hoạt động
          include: {
            user: true,
            likes: true,
            reposts: true,
            comments: { include: { user: true } },
            _count: {
              select: { likes: true, reposts: true, comments: true },
            },
          },
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

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.user.create({
      data: {
        ...dto,
        hashedPassword,
      },
    });
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    files?: {
      avatar?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
  ) {
    const avatarFile = files?.avatar?.[0];
    const coverFile = files?.cover?.[0];

    let avatarUrl: string | null = null;
    let coverUrl: string | null = null;

    if (avatarFile) {
      const result = await this.cloudinaryService.uploadFile(avatarFile);
      avatarUrl = result.secure_url;
    }
    if (coverFile) {
      const result = await this.cloudinaryService.uploadFile(coverFile);
      coverUrl = result.secure_url;
    }

    // Kiểm tra profile tồn tại
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId: id },
    });

    // Xây dựng dữ liệu update
    const profileData: Prisma.ProfileUpdateInput = {};

    if (dto.bio !== undefined) profileData.bio = dto.bio;
    if (dto.location !== undefined) profileData.location = dto.location;
    if (coverUrl) profileData.coverUrl = coverUrl;

    // Xử lý websiteProfiles
    if (Array.isArray(dto.websiteProfiles)) {
      const processedLinks = await Promise.all(
        dto.websiteProfiles.map(async (link) => {
          if (link.websiteTypeId === 'instagram-mock') {
            let type = await this.prisma.websiteType.findUnique({
              where: { type: 'INSTAGRAM' },
            });
            if (!type) {
              type = await this.prisma.websiteType.create({
                data: { type: 'INSTAGRAM', icon: 'instagram' },
              });
            }
            return { ...link, websiteTypeId: type.id };
          }
          return link;
        }),
      );

      // Update DTO so that the 'create' block below uses the correct IDs
      dto.websiteProfiles = processedLinks;

      profileData.websiteProfiles = {
        deleteMany: {}, // Xóa tất cả cái cũ
        create: processedLinks.map((link) => ({
          url: link.url,
          websiteTypeId: link.websiteTypeId,
        })),
      };
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(avatarUrl && { image: avatarUrl }),

        profile: existingProfile
          ? { update: profileData }
          : {
            create: {
              bio: dto.bio ?? null,
              location: dto.location ?? null,
              coverUrl: coverUrl ?? null,
              websiteProfiles: Array.isArray(dto.websiteProfiles)
                ? {
                  create: dto.websiteProfiles.map((link) => ({
                    url: link.url,
                    websiteTypeId: link.websiteTypeId,
                  })),
                }
                : undefined,
            },
          },
      },
      include: {
        profile: {
          include: {
            websiteProfiles: {
              include: { websiteType: true },
            },
          },
        },
      },
    });
  }
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
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

  async getTrendingArtistsByRecentPlays(limit: number = 10) {
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

    return result.map((artist) => ({
      ...artist,
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

  async searchUsers(
    keyword: string,
    currentUserId: string | null,
    page: number = 1,
    limit: number = 10,
  ) {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    // 1. Điều kiện tìm kiếm: Tên hoặc Email chứa keyword
    const whereCondition = {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' as const } },
        { email: { contains: keyword, mode: 'insensitive' as const } },
        // Nếu có username thì thêm: { username: { contains: keyword, ... } }
      ],
    };

    // 2. Query Database
    const [total, users] = await Promise.all([
      this.prisma.user.count({ where: whereCondition }),
      this.prisma.user.findMany({
        where: whereCondition,
        take,
        skip,
        include: {
          // 👇 LOGIC CHECK FOLLOW:
          // Tìm trong danh sách người theo dõi user này, xem có 'currentUserId' không?
          followers: currentUserId
            ? {
              where: { followerId: currentUserId },
              select: { followerId: true }, // Chỉ cần lấy ID để check length
            }
            : false, // Nếu khách thì không lấy

          // Đếm số lượng followers/tracks để hiển thị UI
          _count: {
            select: {
              followers: true,
              tracks: true, // Nếu user có quan hệ tracks
            },
          },
        },
      }),
    ]);

    // 3. Map dữ liệu để thêm trường 'isFollowed' (boolean)
    const data = users.map((user) => {
      const isFollowed = currentUserId ? user.followers.length > 0 : false;

      // Xóa mảng followers đi cho nhẹ response, chỉ giữ lại isFollowed
      const { followers, ...rest } = user;

      return {
        ...rest,
        isFollowed, // ✅ Field này sẽ được FE dùng để active nút Follow
      };
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

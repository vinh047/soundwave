import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma, Track, User } from '@repo/database';
import { PaginatedResult } from '../dto/PaginatedResult';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import toStream = require('streamifier');

export type TrackWithStats = Prisma.TrackGetPayload<{
  include: {
    user: true;
    _count: {
      select: {
        likes: true;
        reposts: true;
        comments: true;
      };
    };
  };
}>;

@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

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

  private async generateRealWaveform(buffer: Buffer): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const samples: number[] = [];
      const numPoints = 100; // Số cột sóng muốn hiển thị (SoundCloud dùng khoảng 100-150)

      // Tạo stream từ buffer file nhạc
      const stream = toStream.createReadStream(buffer);

      // Một stream tạm để hứng dữ liệu Raw từ FFmpeg
      const outputStream = new PassThrough();

      // Cấu hình FFmpeg: Chuyển sang Raw PCM (1 kênh mono, 4000Hz cho nhẹ)
      const ffmpegCommand = ffmpeg(stream)
        .audioCodec('pcm_s16le') // Codec raw
        .format('s16le') // Định dạng 16-bit signed little-endian
        .audioChannels(1) // Gộp thành 1 kênh mono
        .audioFrequency(4000) // Sample rate thấp để xử lý nhanh
        .on('error', (err) => {
          console.error('FFmpeg Error:', err);
          // Nếu lỗi thì fallback về mảng rỗng hoặc random để ko chết app
          resolve(Array.from({ length: 100 }, () => 0));
        });

      // Pipe dữ liệu ra stream
      ffmpegCommand.pipe(outputStream);

      // Đọc dữ liệu từ stream
      const rawData: number[] = [];

      outputStream.on('data', (chunk: Buffer) => {
        // Mỗi mẫu 16-bit chiếm 2 bytes. Đọc Int16.
        for (let i = 0; i < chunk.length; i += 2) {
          if (i + 1 < chunk.length) {
            // Lấy giá trị tuyệt đối (biên độ)
            const amplitude = Math.abs(chunk.readInt16LE(i));
            rawData.push(amplitude);
          }
        }
      });

      outputStream.on('end', () => {
        // Thuật toán Downsampling (Nén dữ liệu khổng lồ thành 100 điểm)
        const step = Math.ceil(rawData.length / numPoints);

        for (let i = 0; i < numPoints; i++) {
          const start = i * step;
          const end = start + step;
          const slice = rawData.slice(start, end);

          // Lấy giá trị lớn nhất trong đoạn (Peak)
          let max = 0;
          for (const val of slice) {
            if (val > max) max = val;
          }

          // Chuẩn hóa về thang 0-100 (Max PCM 16-bit là 32767)
          // Làm trơn số liệu một chút
          let normalized = max / 32767;
          if (normalized > 1) normalized = 1;
          samples.push(Number(normalized.toFixed(4)));
        }

        resolve(samples);
      });
    });
  }

  async create(
    dto: CreateTrackDto,
    userId: string,
    audioFile: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    // 1. Upload Cloudinary (Chạy song song với tạo waveform để tiết kiệm thời gian)
    const uploadAudioPromise = this.cloudinaryService.uploadFile(audioFile);

    // 2. Tạo Waveform THẬT từ buffer
    // Lưu ý: Việc này tốn CPU, nếu file quá lớn có thể làm chậm server
    const waveformPromise = this.generateRealWaveform(audioFile.buffer);

    // Chờ cả 2 xong
    const [audioResult, waveform] = await Promise.all([
      uploadAudioPromise,
      waveformPromise,
    ]);

    const audioUrl = audioResult.secure_url;
    // Lấy duration từ Cloudinary (giây) -> Đổi sang Milliseconds (DB thường lưu ms hoặc giây tùy bạn)
    // Ở đây schema của bạn là Int (giây) nên Math.round là chuẩn.
    const duration = audioResult.duration
      ? Math.round(audioResult.duration)
      : 0;

    // 3. Upload ảnh (nếu có)
    let imageUrl = null;
    if (imageFile) {
      const imageResult = await this.cloudinaryService.uploadFile(imageFile);
      imageUrl = imageResult.secure_url;
    }

    const { title, description, isPublic } = dto;

    // 4. Lưu vào DB
    return await this.prisma.track.create({
      data: {
        title,
        description,
        isPublic,

        audioPath: audioUrl,
        imagePath: imageUrl,

        duration: duration,
        waveform: waveform, // Mảng số thật đã tính toán

        user: { connect: { id: userId } },
      },
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

  async getTrendingTopN({
    days = 7,
    limit = 20,
  }: { days?: number; limit?: number } = {}): Promise<TrackWithStats[]> {
    // <-- Đổi kiểu trả về
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 1) group likes (Lấy dữ liệu recent để tính điểm trending)
    const likes = await this.prisma.like.groupBy({
      by: ['trackId'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    });
    const likesMap = new Map(
      likes.map((r) => [r.trackId, Number(r._count._all)]),
    );

    // 2) group reposts (Lấy dữ liệu recent để tính điểm trending)
    const reposts = await this.prisma.repost.groupBy({
      by: ['trackId'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    });
    const repostsMap = new Map(
      reposts.map((r) => [r.trackId, Number(r._count._all)]),
    );

    // 3) Determine candidates
    const candidateTrackIds = Array.from(
      new Set([
        ...likes.map((l) => l.trackId),
        ...reposts.map((r) => r.trackId),
      ]),
    );

    // --- CẤU HÌNH INCLUDE CHUNG (QUAN TRỌNG) ---
    // Lấy User và đếm tổng số Like/Repost/Comment
    const commonInclude = {
      user: true,
      _count: {
        select: {
          likes: true,
          reposts: true,
          comments: true,
        },
      },
    };

    let tracks: TrackWithStats[]; // <-- Sử dụng type mới

    if (candidateTrackIds.length > 0) {
      tracks = await this.prisma.track.findMany({
        where: {
          id: { in: candidateTrackIds },
          isPublic: true,
          isBanned: false,
        },
        include: commonInclude, // <-- Thêm include vào đây
      });
    } else {
      // fallback: use playCount
      tracks = await this.prisma.track.findMany({
        where: { isPublic: true, isBanned: false },
        orderBy: { playCount: 'desc' },
        take: limit,
        include: commonInclude, // <-- Thêm include vào đây
      });
    }

    // 4) compute score (Logic tính điểm giữ nguyên)
    const now = new Date();
    const items = tracks.map((t) => {
      // Dùng map để lấy recent activity cho việc xếp hạng
      const recentLikes = likesMap.get(t.id) || 0;
      const recentReposts = repostsMap.get(t.id) || 0;

      const ageDays = Math.max(
        1,
        (now.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      const score =
        recentLikes * 3 +
        recentReposts * 4 +
        (t.playCount || 0) * Math.exp(-ageDays / 30);

      return { track: t, score };
    });

    // 5) sort & return
    items.sort((a, b) => b.score - a.score);
    return items.slice(0, limit).map((i) => i.track);
  }

  async recordListen(userId: string | null, trackId: string) {
    if (!userId) {
      // anonymous: you can still insert Play log (if using Play), or ignore
      return;
    }

    // Upsert RecentListen
    await this.prisma.recentListen.upsert({
      where: { userId_trackId: { userId, trackId } }, // needs @@unique([userId, trackId]) and a compound name
      update: {
        lastPlayedAt: new Date(),
        playCount: { increment: 1 as any }, // Prisma numeric increment syntax may vary
      },
      create: {
        userId,
        trackId,
        lastPlayedAt: new Date(),
        playCount: 1,
      },
    });
  }

  async getUserRecentTracks(
    userId: string,
    limit = 20,
  ): Promise<
    Prisma.RecentListenGetPayload<{
      include: { track: { include: { user: true } } };
    }>[]
  > {
    return this.prisma.recentListen.findMany({
      where: { userId },
      orderBy: { lastPlayedAt: 'desc' },
      take: limit,
      include: { track: { include: { user: true } } },
    });
  }
}

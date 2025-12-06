// apps/api/src/tracks/tracks.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Public } from 'src/decorator/customize';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <-- Ví dụ
// import { AuthUser } from '../auth/auth-user.decorator'; // <-- Ví dụ

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // <-- Bạn sẽ cần bảo vệ route này
  create(
    @Body() createTrackDto: CreateTrackDto,
    // @AuthUser('id') userId: string, // <-- Lấy userId từ token
  ) {
    // Tạm thời hardcode userId nếu chưa có Auth
    const FAKE_USER_ID = 'your-fake-user-id'; // <-- THAY THẾ KHI CÓ AUTH

    // SỬA LỖI 2: Truyền userId vào service
    return this.tracksService.create(createTrackDto, FAKE_USER_ID);
  }

  @Public()
  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  // GET /tracks/trending?limit=5
  @Public() // Bỏ nếu bạn muốn route này cần login
  @Get('trending')
  async getTrendingTopN(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    // Gọi service
    return this.tracksService.getTrendingTopN({ days, limit });
  }

  /**
   * GET /tracks/recent?limit=20
   * Lấy danh sách track gần đây của user
   */
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async getRecentTracks(@Req() req, @Query('limit') limit?: string) {
    const userId = req.user.id;
    const take = limit ? Number(limit) : 10;

    const items = await this.tracksService.getUserRecentTracks(userId, take);

    return items.map((i) => i.track);
  }

  /**
   * POST /tracks/:id/listen
   * Ghi nhận lượt nghe của user
   */
  @UseGuards(JwtAuthGuard) // nếu muốn yêu cầu token
  @Post(':id/listen')
  async recordListen(@Param('id') trackId: string, @Req() req) {
    const userId = req.user?.id ?? null;

    await this.tracksService.recordListen(userId, trackId);

    return { message: 'Listen recorded' };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // <-- Cần bảo vệ
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // <-- Cần bảo vệ
  remove(@Param('id') id: string) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.remove(id);
  }
}

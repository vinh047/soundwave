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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Public } from 'src/decorator/customize';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  create(
    @Body() createTrackDto: CreateTrackDto,
    @Req() req,
    @UploadedFiles()
    files: { audio?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    const userId = req.user.id;

    // 4. Kiểm tra file Audio bắt buộc
    if (!files || !files.audio || files.audio.length === 0) {
      throw new BadRequestException('File âm thanh là bắt buộc');
    }

    const audioFile = files.audio[0];
    const imageFile = files.image ? files.image[0] : undefined;

    // 5. Truyền file vào Service để xử lý (Upload lên Cloud/Disk)
    return this.tracksService.create(
      createTrackDto,
      userId,
      audioFile,
      imageFile,
    );
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,

    @Query('q') q: string,
    @Query('search') search: string,
    @Req() req,
  ) {
    const keyword = q || search;
    const userId = req.user?.id || null;

    return this.tracksService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      keyword,
      userId,
    );
  }

  @Public()
  @Get('search/everything')
  searchEverything(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('q') q: string,
    @Req() req,
  ) {
    const userId = req.user?.id || null;
    

    return this.tracksService.searchEverything(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      q || '',
      userId,
    );
  }

  // GET /tracks/trending?limit=5
  @Public()
  @Get('trending')
  async getTrendingTopN(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
    @Req() req,
  ) {
    const userId = req.user?.id || null;

    console.log("userId:treding..... ", req.user)


    return this.tracksService.getTrendingTopN(userId, { days, limit });
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
   * API: Ghi nhận lượt nghe
   * POST /api/tracks/:id/listen
   * - Public: Khách nghe cũng tính view.
   * - UseGuards: Vẫn chạy qua Guard để lấy userId (nếu có token).
   */
  @Public()
  @UseGuards(JwtAuthGuard)
  @Post(':id/listen')
  @HttpCode(HttpStatus.OK)
  async recordListen(@Param('id') trackId: string, @Req() req) {
    const userId = req.user?.id ?? null;
    console.log('User from Req:', req.user);

    await this.tracksService.recordListen(userId, trackId);

    return { message: 'Listen recorded successfully' };
  }

  // --- SOCIAL INTERACTIONS ---

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeTrack(@Param('id') trackId: string, @Req() req) {
    return this.tracksService.likeTrack(req.user.id, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikeTrack(@Param('id') trackId: string, @Req() req) {
    return this.tracksService.unlikeTrack(req.user.id, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/repost')
  async repostTrack(@Param('id') trackId: string, @Req() req) {
    return this.tracksService.repostTrack(req.user.id, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/repost')
  async unrepostTrack(@Param('id') trackId: string, @Req() req) {
    return this.tracksService.unrepostTrack(req.user.id, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async commentTrack(
    @Param('id') trackId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.tracksService.commentTrack(req.user.id, trackId, content);
  }

  @Public()
  @Get(':id/comments')
  async getComments(@Param('id') trackId: string) {
    return this.tracksService.getComments(trackId);
  }

  @UseGuards(JwtAuthGuard) // Bắt buộc đăng nhập mới check được
  @Get(':id/check-like')
  checkLike(@Param('id') id: string, @Req() req) {
    return this.tracksService.checkLike(id, req.user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.findOne(id);
  }

  @Public()
  @Get('user/:userId')
  findTracksByUser(@Param('userId') userId: string) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.findTracksByOwner(userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('cover'))
  async updateTrack(
    @Param('id') trackId: string,
    @Req() req: any,
    @Body() dto: UpdateTrackDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.tracksService.updateTrackByOwner(
      trackId,
      req.user.id,
      dto,
      cover,
    );
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // <-- Cần bảo vệ
  remove(@Param('id') id: string) {
    // SỬA LỖI 1: Gỡ bỏ dấu '+'
    return this.tracksService.remove(id);
  }
}

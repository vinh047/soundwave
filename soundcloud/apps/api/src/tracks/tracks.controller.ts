// apps/api/src/tracks/tracks.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
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

  @Get()
  findAll() {
    console.log('oke');
    return this.tracksService.findAll();
  }

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

// src/admin/tracks/tracks.controller.ts
import { Controller, Get, UseGuards, Query, Patch, Param, Body } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { UpdateTrackStatusDto } from './dto/update-track-status.dto';
import { PaginationDto } from '../users/dto/pagination.dto';

@Controller('admin/tracks')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  /**
   * SD Step 2: Yêu cầu danh sách bài hát
   * API GET /admin/tracks
   */
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.tracksService.findAll(query);
  }

  /**
   * SD Step 9: Yêu cầu cập nhật trạng thái bài hát (Ẩn/Hiện)
   * API PATCH /admin/tracks/:id/status
   */
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateTrackStatusDto: UpdateTrackStatusDto) {
    const result = await this.tracksService.updateStatus(id, updateTrackStatusDto);
    const action = result.isBanned ? 'ẨN (CẤM)' : 'HIỆN LẠI';
    return {
      success: true,
      message: `Đã ${action} bài hát "${result.title}" thành công.`,
    };
  }
}
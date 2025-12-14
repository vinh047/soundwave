// apps/api/src/reports/reports.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Public } from 'src/decorator/customize'; // Giả định decorator Public tồn tại
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard'; // Giả định JwtAuthGuard tồn tại
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * [Public] Lấy danh sách các lý do báo cáo
   * GET /report-reasons (Đặt ngoài reports vì là một loại data tĩnh)
   */
  @Public()
  @Get('report-reasons')
  findAllReasons() {
    return this.reportsService.findAllReasons();
  }

  /**
   * [Protected] Tạo báo cáo mới (Người dùng đã đăng nhập)
   * POST /reports
   */
  @UseGuards(JwtAuthGuard)
  @Post('reports')
  @HttpCode(HttpStatus.CREATED)
  createReport(@Body() createReportDto: CreateReportDto, @Req() req) {
    const reporterId = req.user.id; // Lấy ID của người báo cáo từ JWT token

    return this.reportsService.createReport(reporterId, createReportDto);
  }
}
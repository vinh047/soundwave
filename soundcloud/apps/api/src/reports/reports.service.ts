// apps/api/src/reports/reports.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import type { ReportReason, Report } from '@repo/database';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy danh sách các lý do báo cáo
   * GET /report-reasons
   */
  async findAllReasons(): Promise<ReportReason[]> {
    return this.prisma.reportReason.findMany({
      orderBy: { reason: 'asc' }, // Sắp xếp theo tên lý do
    });
  }

  /**
   * Tạo báo cáo mới
   * POST /reports
   */
  async createReport(
    reporterId: string,
    dto: CreateReportDto,
  ): Promise<Report> {
    const { reportReasonId, trackId, message } = dto;

    // 1. Kiểm tra Track có tồn tại không
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new NotFoundException(`Track with ID "${trackId}" not found`);
    }

    // 2. Kiểm tra ReportReason có tồn tại không
    const reason = await this.prisma.reportReason.findUnique({
      where: { id: reportReasonId },
    });
    if (!reason) {
      throw new NotFoundException(
        `Report Reason with ID "${reportReasonId}" not found`,
      );
    }

    // 3. Tạo Report
    return this.prisma.report.create({
      data: {
        trackId: trackId,
        reportReasonId: reportReasonId,
        message: message,
        reporterId: reporterId,
      },
      include: {
        reportReason: true,
        track: true,
        reporter: true,
      },
    });
  }
}
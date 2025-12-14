// src/admin/reports/reports.controller.ts
import { Controller, Get, UseGuards, Param, Patch, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { UpdateReportActionDto } from './dto/update-report-status.dto';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  /**
   * SD Step 2: Yêu cầu danh sách báo cáo vi phạm
   * API GET /admin/reports
   */
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  /**
   * SD Step 8: Yêu cầu xử lý và cập nhật trạng thái báo cáo vi phạm
   * API PATCH /admin/reports/:id/action
   */
  @Patch(':id/action')
  handleAction(
    @Param('id') id: string,
    @Body() updateReportActionDto: UpdateReportActionDto,
  ) {
    return this.reportsService.handleReportAction(
      id,
      updateReportActionDto.action,
    );
  }
}
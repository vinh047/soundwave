import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminReportAction } from './dto/update-report-status.dto';
import { EmailService } from '../../email/email.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * SD Step 3: Yêu cầu danh sách báo cáo vi phạm
   */
  async findAll() {
    return this.prisma.report.findMany({
      include: {
        reportReason: true,
        reporter: { select: { id: true, email: true, name: true } },
        track: {
          select: {
            id: true,
            title: true,
            userId: true,
            isBanned: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * SD Step 9: Yêu cầu xử lý và cập nhật trạng thái báo cáo
   */
  async handleReportAction(reportId: string, action: AdminReportAction) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        track: { select: { id: true, userId: true, title: true } }
      },
    });

    if (!report || !report.track) {
      throw new NotFoundException('Báo cáo hoặc Bài hát vi phạm không còn tồn tại.');
    }

    switch (action) {
      case AdminReportAction.DELETE_TRACK:
        // Cấm bài hát (isBanned = true)
        await this.prisma.track.update({
          where: { id: report.track.id },
          data: { isBanned: true },
        });

        // Xóa Report (tương đương với đóng báo cáo do thiếu trường status)
        await this.prisma.report.delete({ where: { id: reportId } });

        // SD Step 10: Gửi thông báo kết quả xử lý báo cáo (UC_WarnUser)
        // Lấy email người dùng
        const user = await this.prisma.user.findUnique({ where: { id: report.track.userId } });
        if (user) {
          this.emailService.sendWarning(user.email, report.track.title);
        }

        return {
          success: true,
          message: `Đã CẤM bài hát: "${report.track.title}". Báo cáo đã được đóng và cảnh cáo đã được gửi.`,
        };

      case AdminReportAction.DISMISS_REPORT:
        // Bỏ qua báo cáo (Xóa Report)
        await this.prisma.report.delete({ where: { id: reportId } });
        return {
          success: true,
          message: 'Báo cáo đã được BỎ QUA và xóa khỏi danh sách chờ xử lý.',
        };

      default:
        throw new Error('Hành động không hợp lệ.');
    }
  }
}
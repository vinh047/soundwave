// src/admin/reports/dto/update-report-action.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AdminReportAction {
  DELETE_TRACK = 'DELETE_TRACK',      // Ẩn/Cấm bài hát vi phạm (UC_HideReportedSongs)
  DISMISS_REPORT = 'DISMISS_REPORT',  // Bỏ qua báo cáo (UC_DismissReport)
}

export class UpdateReportActionDto {
  @IsEnum(AdminReportAction)
  @IsNotEmpty()
  action: AdminReportAction;
}
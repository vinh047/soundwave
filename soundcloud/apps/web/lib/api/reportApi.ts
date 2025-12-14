// src/lib/api/reportApi.ts

import { Report, ReportReason } from "@repo/database";
import axiosClient from "./apiClient";

// Định nghĩa payload gửi đi
type CreateReportPayload = {
  reportReasonId: string;
  trackId: string;
  message?: string; // Tùy chọn
};

const reportApi = {
  // 1. Lấy danh sách các lý do báo cáo (ví dụ: SPAM, HATE_SPEECH, etc.)
  getReportReasons: () => axiosClient.get<ReportReason[]>("/report-reasons"),

  // 2. Gửi báo cáo mới
  createReport: (data: CreateReportPayload) =>
    axiosClient.post<Report>("/reports", data),
};

export default reportApi;

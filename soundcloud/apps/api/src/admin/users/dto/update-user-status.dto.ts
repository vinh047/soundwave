// src/admin/users/dto/update-user-status.dto.ts
import { IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * DTO để cập nhật trạng thái người dùng (ví dụ: khoá/mở khoá)
 * LƯU Ý: Chức năng này không hoạt động do thiếu trường 'isBanned' trong Model User.
 */
export class UpdateUserStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean; // true: khoá, false: mở khoá
}
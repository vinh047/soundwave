// src/admin/tracks/dto/update-track-status.dto.ts
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTrackStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean; // true: Ẩn (Bị cấm), false: Hiện lại
}
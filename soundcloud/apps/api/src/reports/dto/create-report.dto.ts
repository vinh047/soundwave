import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'Report reason is required' })
  @IsString()
  reportReasonId!: string;

  @IsNotEmpty({ message: 'Track ID is required' })
  @IsString()
  trackId!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  artist?: string;

  @IsBoolean()
  @Transform(({ value }) => {
    return value === 'true' || value === true;
  })
  isPublic: boolean = true; // Mặc định là true nếu không gửi lên
}

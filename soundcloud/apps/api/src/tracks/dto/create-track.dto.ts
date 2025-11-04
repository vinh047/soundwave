// apps/api/src/tracks/dto/create-track.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateTrackDto {
  // Dựa trên schema.prisma của bạn

  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsString()
  @IsNotEmpty()
  audioPath: string = '';

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

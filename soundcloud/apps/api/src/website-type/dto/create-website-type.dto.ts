import { IsString, IsOptional } from 'class-validator';

export class CreateWebsiteTypeDto {
  @IsString()
  type: string = '';

  @IsOptional()
  @IsString()
  icon?: string;
}

import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class WebsiteProfileDto {
  @IsNotEmpty()
  @IsString()
  websiteTypeId: string = '';

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(2000)
  url: string = '';
}

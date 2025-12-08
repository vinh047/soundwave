import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreatePlaylistDto {
    @IsString()
    @IsNotEmpty()
    title: string = '';

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}

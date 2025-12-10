import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResult } from '../dto/PaginatedResult';
import { Public } from 'src/decorator/customize';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const user = await this.usersService.findOneWithPasswordHashByEmail(email);

    if (!user) {
      return { method: 'NEW_USER' };
    }

    if (user.hashedPassword) {
      return { method: 'PASSWORD' };
    }

    return { method: 'GOOGLE' };
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResult<any>> {
    return this.usersService.findAll(page, limit);
  }

  @Public()
  @Get('trending')
  async getTrendingArtists(@Query('limit') limit: string) {
    const take = Number(limit) || 10;

    const artists =
      await this.usersService.getTrendingArtistsByRecentPlays(take);

    return {
      message: 'Lấy danh sách nghệ sĩ thịnh hành thành công',
      data: artists,
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Get(':id/profile-data')
  findProfile(@Param('id') id: string) {
    return this.usersService.getArtistProfileData(id);
  }

  @Public()
  @Get(':id/playlists')
  async getPlaylists(@Param('id') id: string) {
    const data = await this.usersService.getAllPlaylistsByUserId(id);
    return { data };
  }

  @Public()
  @Get(':id/reposts')
  async getReposts(@Param('id') id: string) {
    const data = await this.usersService.getAllRepostsByUserId(id);
    return { data };
  }

  @Public()
  @Get(':id/tracks')
  async getTracks(@Param('id') id: string) {
    const data = await this.usersService.getAllTracksByUserId(id);
    return { data };
  }

  @Public()
  @Get(':id/popular-tracks')
  async getPopularTracks(@Param('id') id: string) {
    const data = await this.usersService.findPopularTracksByUser(id);
    return { data };
  }

  @Public()
  @Get(':id/followers')
  async getFlowers(@Param('id') id: string) {
    const data = await this.usersService.getFollowersByUserId(id);
    return { data };
  }
  @Public()
  @Get(':id/following')
  async getFollowing(@Param('id') id: string) {
    const data = await this.usersService.getFollowingByUserId(id);
    return { data };
  }
  @Public()
  @Get(':id/likes')
  async getLikes(@Param('id') id: string) {
    const data = await this.usersService.getLikesByUserId(id);
    return { data };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
  ) {
    if (dto.websiteProfiles && typeof dto.websiteProfiles === 'string') {
      try {
        dto.websiteProfiles = JSON.parse(dto.websiteProfiles);
      } catch (error) {
        console.error('Failed to parse websiteProfiles:', error);
        throw new BadRequestException('Invalid websiteProfiles JSON format');
      }
    }

    if (Array.isArray(dto.websiteProfiles)) {
      const validLinks = dto.websiteProfiles.filter(
        (link) => link.url && link.websiteTypeId,
      );

      dto.websiteProfiles = validLinks;
    }

    return this.usersService.updateUser(id, dto, files);
  }
}

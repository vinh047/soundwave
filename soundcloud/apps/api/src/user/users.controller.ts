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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResult } from '../dto/PaginatedResult';
import { Public } from 'src/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const user = await this.usersService.findOneWithPasswordHashByEmail(email);

    if (!user) {
      return { method: 'NEW_USER' }; // Email mới
    }

    if (user.hashedPassword) {
      return { method: 'PASSWORD' }; // Đã đăng ký bằng mật khẩu
    }

    return { method: 'GOOGLE' }; // Đã đăng ký bằng Google
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResult<any>> {
    return this.usersService.findAll(page, limit);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Get(':id/playlists')
  async getPlaylists(@Param('id') id: string) {
    const data = await this.usersService.findPlaylistsByUser(id);
    return { data };
  }

  @Public()
  @Get(':id/reposts')
  async getReposts(@Param('id') id: string) {
    const data = await this.usersService.findRepostByUser(id);
    return { data };
  }

  @Public()
  @Get(':id/popular-tracks')
  async getPopularTracks(@Param('id') id: string) {
    const data = await this.usersService.findPopularTracksByUser(id);
    return { data };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}

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

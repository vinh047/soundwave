import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { Public } from 'src/decorator/customize';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @Public()
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.playlistsService.search(
      q || '',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Req() req) {
    return this.playlistsService.create(req.user.id, createPlaylistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findAll(@Req() req) {
    return this.playlistsService.findAllByUser(req.user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @Req() req,
  ) {
    return this.playlistsService.update(req.user.id, id, updatePlaylistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.playlistsService.remove(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/tracks')
  addTrack(
    @Param('id') id: string,
    @Body('trackId') trackId: string,
    @Req() req,
  ) {
    return this.playlistsService.addTrack(req.user.id, id, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/tracks/:trackId')
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') trackId: string,
    @Req() req,
  ) {
    return this.playlistsService.removeTrack(req.user.id, id, trackId);
  }
}

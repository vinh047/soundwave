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

import { Public } from 'src/decorator/customize';
import { PaginatedResult } from '../dto/PaginatedResult';
import { WebsiteTypeService } from './website-type.service';
import { UpdateWebsiteTypeDto } from './dto/update-website-type.dto';
import { CreateWebsiteTypeDto } from './dto/create-website-type.dto';

@Controller('website-types')
export class WebsiteTypeController {
  constructor(private readonly service: WebsiteTypeService) {}

  @Public()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResult<any>> {
    return this.service.findAll(page, limit);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateWebsiteTypeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWebsiteTypeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Deleted successfully' };
  }
}

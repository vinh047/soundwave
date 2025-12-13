import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import type { WebsiteType } from '@repo/database';
import { CreateWebsiteTypeDto } from './dto/create-website-type.dto';
import { UpdateWebsiteTypeDto } from './dto/update-website-type.dto';

@Injectable()
export class WebsiteTypeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebsiteTypeDto): Promise<WebsiteType> {
    return this.prisma.websiteType.create({
      data: dto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    const total = await this.prisma.websiteType.count();

    const data = await this.prisma.websiteType.findMany({
      skip,
      take,
      orderBy: { type: 'asc' },
    });

    return {
      data,
      total,
      page,
      limit: take,
    };
  }

  async findOne(id: string): Promise<WebsiteType> {
    const result = await this.prisma.websiteType.findUnique({
      where: { id },
      include: {
        websiteProfiles: true, // nếu bạn muốn include
      },
    });

    if (!result) {
      throw new NotFoundException(`WebsiteType ID "${id}" not found`);
    }

    return result;
  }

  async update(id: string, dto: UpdateWebsiteTypeDto): Promise<WebsiteType> {
    try {
      return await this.prisma.websiteType.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException(`WebsiteType ID "${id}" not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.websiteType.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`WebsiteType ID "${id}" not found`);
    }
  }
}

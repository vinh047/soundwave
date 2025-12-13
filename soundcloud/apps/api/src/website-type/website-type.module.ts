import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { WebsiteTypeController } from './website-type.controller';
import { WebsiteTypeService } from './website-type.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebsiteTypeController],
  providers: [WebsiteTypeService],
  exports: [WebsiteTypeService],
})
export class WebsiteTypeModule {}

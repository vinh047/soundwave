// src/admin/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../../email/email.module'; // Giả định EmailModule nằm ở cấp src/email

@Module({
  imports: [PrismaModule, EmailModule], 
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
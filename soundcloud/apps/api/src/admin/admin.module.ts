// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from '../auth/auth.module'; // Tái sử dụng Auth Service

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ReportsModule,
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
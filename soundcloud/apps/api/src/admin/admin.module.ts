// src/admin/admin.module.ts
// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TracksModule } from './tracks/tracks.module'; // Import TracksModule
import { AuthModule } from '../auth/auth.module'; // Tái sử dụng Auth Service

import { AdminService } from './admin.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ReportsModule,
    TracksModule, // Register TracksModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
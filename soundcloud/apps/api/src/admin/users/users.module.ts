// src/admin/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module'; // Đảm bảo đúng đường dẫn

@Module({
  imports: [PrismaModule], 
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
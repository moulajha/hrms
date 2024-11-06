import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseService } from '../../config/supabase.config';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
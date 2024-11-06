import { Module } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [DeploymentsController],
  providers: [DeploymentsService, PrismaService],
})
export class DeploymentsModule {}
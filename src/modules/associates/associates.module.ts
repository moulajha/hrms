import { Module } from '@nestjs/common';
import { AssociatesController } from './associates.controller';
import { AssociatesService } from './associates.service';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [AssociatesController],
  providers: [AssociatesService, PrismaService],
})
export class AssociatesModule {}
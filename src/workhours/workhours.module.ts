import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { WorkhoursController } from './workhours.controller';
import { WorkhoursService } from './workhours.service';

@Module({
  controllers: [WorkhoursController],
  providers: [WorkhoursService, PrismaService],
})
export class WorkhoursModule {}

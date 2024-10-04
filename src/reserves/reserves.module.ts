import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReservesController } from './reserves.controller';
import { ReservesService } from './reserves.service';

@Module({
  controllers: [ReservesController],
  providers: [ReservesService, PrismaService],
})
export class ReservesModule {}

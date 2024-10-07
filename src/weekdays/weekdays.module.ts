import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReservesService } from 'src/reserves/reserves.service';
import { WeekdaysController } from './weekdays.controller';
import { WeekdaysService } from './weekdays.service';
import { WorkhoursService } from 'src/workhours/workhours.service';

@Module({
  controllers: [WeekdaysController],
  providers: [
    WeekdaysService,
    WorkhoursService,
    ReservesService,
    PrismaService,
  ],
})
export class WeekdaysModule {}

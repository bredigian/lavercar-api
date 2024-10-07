import { Module } from '@nestjs/common';
import { ReservesModule } from './reserves/reserves.module';
import { WeekdaysModule } from './weekdays/weekdays.module';
import { WorkhoursModule } from './workhours/workhours.module';

@Module({
  imports: [WorkhoursModule, ReservesModule, WeekdaysModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

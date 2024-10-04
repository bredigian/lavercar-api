import { Module } from '@nestjs/common';
import { WorkhoursModule } from './workhours/workhours.module';
import { ReservesModule } from './reserves/reserves.module';

@Module({
  imports: [WorkhoursModule, ReservesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { WorkhoursModule } from './workhours/workhours.module';

@Module({
  imports: [WorkhoursModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

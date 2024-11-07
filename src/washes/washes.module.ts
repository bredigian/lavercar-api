import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { WashesController } from './washes.controller';
import { WashesService } from './washes.service';

@Module({
  controllers: [WashesController],
  providers: [WashesService, PrismaService],
})
export class WashesModule {}

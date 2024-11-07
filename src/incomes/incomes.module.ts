import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, PrismaService],
})
export class IncomesModule {}

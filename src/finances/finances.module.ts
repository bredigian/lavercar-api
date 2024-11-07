import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [FinancesController],
  providers: [FinancesService, PrismaService],
})
export class FinancesModule {}

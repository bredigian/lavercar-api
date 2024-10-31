import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SeedService } from './seed.service';

@Module({
  providers: [PrismaService, SeedService],
  exports: [SeedService],
})
export class SeedModule {}

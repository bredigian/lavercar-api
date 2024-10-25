import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SessionsService } from './sessions.service';

@Module({
  providers: [SessionsService, PrismaService],
})
export class SessionsModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReservesService } from 'src/reserves/reserves.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  providers: [WhatsappService, ReservesService, PrismaService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}

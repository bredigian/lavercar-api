import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { Module } from '@nestjs/common';
import { PaymentsService } from 'src/payments/payments.service';
import { PrismaService } from 'src/services/prisma.service';
import { ReservesController } from './reserves.controller';
import { ReservesService } from './reserves.service';

@Module({
  controllers: [ReservesController],
  providers: [
    ReservesService,
    PaymentsService,
    MercadopagoService,
    PrismaService,
  ],
})
export class ReservesModule {}

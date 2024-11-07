import { IncomesService } from 'src/incomes/incomes.service';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/services/prisma.service';
import { ReservesService } from 'src/reserves/reserves.service';

@Module({
  providers: [
    PaymentsService,
    ReservesService,
    MercadopagoService,
    IncomesService,
    PrismaService,
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}

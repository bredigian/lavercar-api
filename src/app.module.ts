import { ConfigModule } from '@nestjs/config';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { ReservesModule } from './reserves/reserves.module';
import { WeekdaysModule } from './weekdays/weekdays.module';
import { WorkhoursModule } from './workhours/workhours.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WorkhoursModule,
    ReservesModule,
    WeekdaysModule,
    MercadopagoModule,
    PaymentsModule,
    WhatsappModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

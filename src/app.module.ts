import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { ReservesModule } from './reserves/reserves.module';
import { UserModule } from './user/user.module';
import { WeekdaysModule } from './weekdays/weekdays.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WorkhoursModule } from './workhours/workhours.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WorkhoursModule,
    ReservesModule,
    WeekdaysModule,
    MercadopagoModule,
    PaymentsModule,
    WhatsappModule,
    AuthModule,
    UserModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

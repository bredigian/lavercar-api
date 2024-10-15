import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

import { Injectable } from '@nestjs/common';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { Reserve } from '@prisma/client';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
  }

  async createPreference(payment_reserve: PreferenceRequest) {
    const preference: Preference = new Preference(this.client);

    return await preference.create({ body: payment_reserve });
  }

  async verifyPaymentStatus(id: Reserve['payment_id']) {
    const payment: Payment = new Payment(this.client);

    return await payment.get({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { Reserve } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private mercadopago: MercadopagoService) {}

  async generatePayment(payment_reserve: PreferenceRequest) {
    return await this.mercadopago.createPreference(payment_reserve);
  }

  async verifyStatusById(id: Reserve['payment_id']) {
    return await this.mercadopago.verifyPaymentStatus(id);
  }
}

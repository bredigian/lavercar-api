import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { TPaymentWebhook } from 'src/types/payments.types';
import { PAYMENT_STATUS } from '@prisma/client';
import { ReservesService } from 'src/reserves/reserves.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly service: PaymentsService,
    private readonly reservesService: ReservesService,
  ) {}

  @Version('1')
  @Get()
  async getStatus(@Query() params: { id: PaymentRequest['id'] }) {
    try {
      const { id } = params;
      return await this.service.verifyStatusById(id);
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no está disponible. Intente nuevamente mas tarde.',
      );
    }
  }

  @Version('1')
  @Post()
  async generatePayment(@Body() payment_reserve: PreferenceRequest) {
    try {
      return await this.service.generatePayment(payment_reserve);
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'No se ha podido establecer conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Post('notifications')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleWebhookNotifications(@Body() payload: TPaymentWebhook) {
    try {
      if ('data' in payload) {
        const { data } = payload;
        if ('id' in data) {
          const payment_id = data.id;
          const { additional_info, status } =
            await this.service.verifyStatusById(payment_id);

          const STATUS = status.toUpperCase() as PAYMENT_STATUS;
          if (Object.values(PAYMENT_STATUS).includes(STATUS)) {
            const { items } = additional_info;
            const [{ id }] = items;

            await this.reservesService.handlePaymentStatus(
              id,
              payment_id,
              STATUS,
            );
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }
}

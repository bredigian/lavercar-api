import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { TPaymentWebhook } from 'src/types/payments.types';
import { Income, PAYMENT_STATUS, Reserve } from '@prisma/client';
import { ReservesService } from 'src/reserves/reserves.service';
import { IncomesService } from 'src/incomes/incomes.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly service: PaymentsService,
    private readonly reservesService: ReservesService,
    private readonly incomesService: IncomesService,
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
  @Patch()
  async updatePaymentStatusById(@Body() payload: Partial<Reserve>) {
    try {
      const { id, payment_status, payment_id } = payload;
      const updated = await this.reservesService.handlePaymentStatus(
        id,
        payment_id,
        payment_status,
      );

      const hasIncome = await this.incomesService.findByReserveId(updated.id);
      if (updated.payment_status === 'PENDING' && hasIncome)
        await this.incomesService.deleteByReserveId(updated.id);

      if (!hasIncome && updated.payment_status === 'APPROVED') {
        const INCOME_PAYLOAD: Partial<Income> = {
          reserve_id: id,
          value: 12500,
        };

        await this.incomesService.create(INCOME_PAYLOAD as Income);
      }

      return updated;
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no se encuentra disponible. Intente mas tarde nuevamente.',
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

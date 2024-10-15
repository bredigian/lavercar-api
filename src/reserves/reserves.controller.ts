import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';

// import { DateTime } from 'luxon';

import { ReservesService } from './reserves.service';
import { Reserve } from '@prisma/client';
import { PaymentsService } from 'src/payments/payments.service';
// import { WorkhoursService } from 'src/workhours/workhours.service';

@Controller('reserves')
export class ReservesController {
  constructor(
    private readonly service: ReservesService,
    private readonly paymentsService: PaymentsService,
    // private readonly workhoursService: WorkhoursService,
  ) {}

  @Version('1')
  @Get()
  async getAllFromNow() {
    try {
      return await this.service.getAllFromNow();
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'No se ha podido establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Post()
  async create(@Body() payload: Reserve) {
    try {
      const { date } = payload;
      // const datetime = DateTime.fromJSDate(date);

      // const hour = datetime.hour;
      // const time = datetime.minute;
      // const weekday = datetime.weekday;
      // const isEnabled = await this.workhoursService.isEnabled({
      //   hour,
      //   time,
      //   weekday,
      // });
      // if (!isEnabled)
      //   throw new NotFoundException(
      //     'El horario deseado no se encuentra habilitado.',
      //   );

      const isReserved = await this.service.isReserved(date);
      if (isReserved) throw new ConflictException('El turno ya fue asignado.');

      return await this.service.create(payload);
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'No se ha podido establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Get('detail')
  async getDetail(
    @Query() params: { id: Reserve['id']; number: Reserve['number'] },
  ) {
    try {
      const { id, number } = params;
      const detail = await this.service.getDetail(id ?? Number(number));
      if (!detail) throw new NotFoundException('No se encontró la reserva.');

      return detail;
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'No se ha podido establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Patch()
  async updatePaymentStatusById(@Body() payload: Partial<Reserve>) {
    try {
      const { id, payment_status, payment_id } = payload;
      return await this.service.handlePaymentStatus(
        id,
        payment_id,
        payment_status,
      );
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
}

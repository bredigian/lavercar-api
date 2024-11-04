import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';

import { ReservesService } from './reserves.service';
import { PaymentsService } from 'src/payments/payments.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { TWhatsAppTemplateMessage } from 'src/types/whatsapp.types';
import { DateTime } from 'luxon';
import { EPaymentStatusMessage } from 'src/types/payments.types';
import { WorkhoursService } from 'src/workhours/workhours.service';
import {
  ReserveByDateDto,
  ReserveDetailDto,
  ReserveDto,
  UpdateReserveDto,
} from './reserves.dto';

@Controller('reserves')
export class ReservesController {
  constructor(
    private readonly service: ReservesService,
    private readonly paymentsService: PaymentsService,
    private readonly workhoursService: WorkhoursService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Version('1')
  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getReserves(@Query() query: ReserveByDateDto) {
    try {
      const { date } = query;
      if (!date) return await this.service.getAllFromNow();

      return await this.service.getAllFromDate(new Date(date));
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() payload: ReserveDto) {
    try {
      const { date } = payload;
      const datetime = DateTime.fromJSDate(new Date(date))
        .setLocale('es-AR')
        .setZone('America/Argentina/Buenos_Aires');

      const { hour, minute, weekday } = datetime;
      const isEnabled = await this.workhoursService.isEnabled({
        hour,
        time: minute,
        weekday,
      });
      if (!isEnabled)
        throw new NotFoundException('El horario no se encuentra habilitado.');

      const now = DateTime.now();

      if (datetime.toMillis() < now.toMillis())
        throw new ConflictException(
          'No es posible reservar un turno que ya pasó.',
        );

      const isReserved = await this.service.isReserved(date);
      if (isReserved) throw new ConflictException('El turno ya fue asignado.');

      const reserved = await this.service.create(payload);

      const RESERVE_NUMBER = reserved.number.toString().padStart(6, '0');

      const message: TWhatsAppTemplateMessage = {
        to: payload.user_phone,
        attributes: {
          user_name: reserved.user_name,
          date: datetime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
          time: datetime.toLocaleString(DateTime.TIME_24_SIMPLE) + 'hs',
          number: RESERVE_NUMBER,
        },
        template: 'reserve_created',
      };

      const whatsappResponse = await this.whatsapp.sendTemplateMessage(message);

      return {
        ...reserved,
        whatsapp_message_status: whatsappResponse?.status ?? 400,
      };
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getDetail(@Query() params: ReserveDetailDto) {
    try {
      const { id, number } = params;
      if (!id && !number)
        throw new BadRequestException(
          'Se debe enviar el ID o el número de reserva.',
        );

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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateStatusById(@Body() payload: UpdateReserveDto) {
    try {
      const { id, status } = payload;
      const updated = await this.service.handleStatus(id, status);

      const RESERVE_NUMBER = updated.number.toString().padStart(6, '0');

      const message: TWhatsAppTemplateMessage = {
        to: updated.user_phone,
        attributes: {
          user_name: updated.user_name,
          number: RESERVE_NUMBER,
          payment_status: EPaymentStatusMessage[updated.payment_status],
        },
        template: 'reserve_completed',
      };

      const whatsappResponse = await this.whatsapp.sendTemplateMessage(message);

      return {
        ...updated,
        whatsapp_message_status: whatsappResponse?.status ?? 400,
      };
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

import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';

import { DateTime } from 'luxon';

import { ReservesService } from './reserves.service';
import { Reserve } from '@prisma/client';
import { WorkhoursService } from 'src/workhours/workhours.service';

@Controller('reserves')
export class ReservesController {
  constructor(
    private readonly service: ReservesService,
    private readonly workhoursService: WorkhoursService,
  ) {}

  @Version('1')
  @Post()
  async create(@Body() payload: Reserve) {
    try {
      const { date } = payload;
      const datetime = DateTime.fromJSDate(date);

      const hour = datetime.hour;
      const time = datetime.minute;
      const weekday = datetime.weekday;
      const isEnabled = await this.workhoursService.isEnabled({
        hour,
        time,
        weekday,
      });
      if (!isEnabled)
        throw new NotFoundException(
          'El horario deseado no se encuentra habilitado.',
        );

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
}

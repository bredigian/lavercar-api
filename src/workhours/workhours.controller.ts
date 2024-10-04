import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';

import { WorkhoursService } from './workhours.service';
import { Workhour } from '@prisma/client';

@Controller('workhours')
export class WorkhoursController {
  constructor(private readonly service: WorkhoursService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  async handleStatus(@Body() payload: Workhour) {
    try {
      const workhours = this.service.getAll();
      const exists = workhours.find(
        (item) => item.hour === payload.hour && item.time === payload.time,
      );
      if (!exists)
        throw new NotFoundException('No se ha encontrado ese horario');

      const isEnabled = await this.service.isEnabled(payload);
      if (isEnabled) return await this.service.disable(isEnabled.id);

      return await this.service.enable(payload);
    } catch (e) {
      console.error(e);
      if (e) throw e;

      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }

  @Get('enabled')
  async getAllEnabled() {
    try {
      return await this.service.getAllEnabled();
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }
}

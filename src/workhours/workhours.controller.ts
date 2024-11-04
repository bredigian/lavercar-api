import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  ServiceUnavailableException,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';

import { WorkhoursService } from './workhours.service';
import { EnableWorkhourDto } from './workhours.dto';

@Controller('workhours')
export class WorkhoursController {
  constructor(private readonly service: WorkhoursService) {}

  @Version('1')
  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Version('1')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async enable(@Body() payload: EnableWorkhourDto) {
    try {
      const workhours = this.service.getAll();
      const exists = workhours.find(
        (item) => item.hour === payload.hour && item.time === payload.time,
      );
      if (!exists)
        throw new NotFoundException('No se ha encontrado ese horario');

      const isEnabled = await this.service.isEnabled(payload);
      if (isEnabled)
        throw new ConflictException(
          'El horario de trabajo ya está habilitado.',
        );

      return await this.service.enable(payload);
    } catch (e) {
      console.error(e);
      if (e) throw e;

      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async disable(@Body() payload: EnableWorkhourDto) {
    try {
      const workhours = this.service.getAll();
      const exists = workhours.find(
        (item) => item.hour === payload.hour && item.time === payload.time,
      );
      if (!exists)
        throw new NotFoundException('No se ha encontrado ese horario');

      return await this.service.disable(payload.id);
    } catch (e) {
      console.error(e);
      if (e) throw e;

      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
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

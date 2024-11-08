import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  ServiceUnavailableException,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';

import { WashesService } from './washes.service';
import { WashingDto } from './washes.dto';
import { WashingType } from '@prisma/client';

@Controller('washes')
export class WashesController {
  constructor(private readonly service: WashesService) {}

  @Get()
  @Version('1')
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no se encuentra disponible.',
      );
    }
  }

  @Post()
  @Version('1')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() payload: WashingDto) {
    try {
      return await this.service.create({
        ...payload,
        price: Number(payload.price),
      });
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no se encuentra disponible.',
      );
    }
  }

  @Delete()
  @Version('1')
  async deleteById(@Body() payload: { id: WashingType['id'] }) {
    try {
      return await this.service.deleteById(payload.id);
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no se encuentra disponible.',
      );
    }
  }
}

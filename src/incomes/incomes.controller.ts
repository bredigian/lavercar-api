import {
  Controller,
  Get,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';

import { IncomesService } from './incomes.service';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly service: IncomesService) {}

  @Get()
  @Version('1')
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (e) {
      if (e) {
        console.error();
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no se encuentra disponible.',
      );
    }
  }
}

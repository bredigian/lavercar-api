import {
  Controller,
  Get,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';

import { FinancesService } from './finances.service';

@Controller('finances')
export class FinancesController {
  constructor(private readonly service: FinancesService) {}

  @Get()
  @Version('1')
  async getIncome() {
    try {
      return await this.service.getIncome();
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

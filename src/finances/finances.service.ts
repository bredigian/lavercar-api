import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class FinancesService {
  constructor(private prisma: PrismaService) {}

  async getIncome() {
    return await this.prisma.reserve.findMany({
      where: { payment_status: 'APPROVED' },
      orderBy: { date: 'desc' },
    });
  }
}

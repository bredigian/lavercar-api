import { Income } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.income.findMany({ include: { reserve: true } });
  }

  async create(payload: Income) {
    return await this.prisma.income.create({ data: payload });
  }

  async deleteByReserveId(id: Income['reserve_id']) {
    return await this.prisma.income.delete({ where: { reserve_id: id } });
  }

  async findByReserveId(id: Income['reserve_id']) {
    return await this.prisma.income.findUnique({ where: { reserve_id: id } });
  }
}

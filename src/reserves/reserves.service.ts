import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Reserve } from '@prisma/client';

@Injectable()
export class ReservesService {
  constructor(private prisma: PrismaService) {}

  async create(payload: Reserve) {
    return await this.prisma.reserve.create({ data: payload });
  }

  async isReserved(date: Date) {
    return await this.prisma.reserve.findMany({ where: { date } });
  }
}

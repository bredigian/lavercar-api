import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Reserve } from '@prisma/client';

@Injectable()
export class ReservesService {
  constructor(private prisma: PrismaService) {}

  async getAllFromNow() {
    return await this.prisma.reserve.findMany({
      where: { date: { gte: new Date() } },
    });
  }

  async create(payload: Reserve) {
    return await this.prisma.reserve.create({ data: payload });
  }

  async isReserved(date: Date) {
    return await this.prisma.reserve.findUnique({ where: { date } });
  }

  async getDetail(id: Reserve['id']) {
    return await this.prisma.reserve.findUnique({ where: { id } });
  }

  async getNumberOfReserve(date: Reserve['date']) {
    return await this.prisma.reserve.count({
      where: { created_at: { lte: new Date(date) } },
    });
  }
}

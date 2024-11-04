import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Reserve } from '@prisma/client';
import { ReserveDto } from './reserves.dto';

@Injectable()
export class ReservesService {
  constructor(private prisma: PrismaService) {}

  async getAllFromNow() {
    return await this.prisma.reserve.findMany({
      where: {
        date: { gte: DateTime.now().set({ hour: 0, minute: 0 }).toJSDate() },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getAllFromDate(date: Date) {
    const today = DateTime.fromJSDate(date).set({ hour: 0, minute: 0 });

    return await this.prisma.reserve.findMany({
      where: {
        date: {
          gte: today.toJSDate(),
          lt: today.plus({ days: 1 }).toJSDate(),
        },
      },
    });
  }

  async create(payload: ReserveDto) {
    return await this.prisma.reserve.create({ data: payload });
  }

  async isReserved(date: Date) {
    return await this.prisma.reserve.findUnique({ where: { date } });
  }

  async getDetail(id: Reserve['id'] | Reserve['number']) {
    if (typeof id === 'string')
      return await this.prisma.reserve.findUnique({ where: { id } });

    return await this.prisma.reserve.findFirst({
      where: { number: id as number },
    });
  }

  async handlePaymentStatus(
    id: Reserve['id'],
    payment_id: Reserve['payment_id'],
    payment_status: Reserve['payment_status'],
  ) {
    return await this.prisma.reserve.update({
      where: { id },
      data: { payment_id, payment_status },
    });
  }

  async handleStatus(id: Reserve['id'], status: Reserve['status']) {
    return await this.prisma.reserve.update({
      where: { id },
      data: { status },
    });
  }
}

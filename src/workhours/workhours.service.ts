import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Workhour } from '@prisma/client';
// import { PrismaService } from 'src/services/prisma.service';

type TWorkhour = `${number}:${number}`;

// Horarios cada 45 minutos
const WORKHOURS: TWorkhour[] = [
  '08:30',
  '09:15',
  '10:00',
  '10:45',
  '11:30',
  '12:15',
  '13:00',
  '13:45',
  '14:30',
  '15:15',
  '16:00',
  '16:45',
  '17:30',
  '18:15',
  '19:00',
  '19:45',
  '20:30',
];

@Injectable()
export class WorkhoursService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    const workhours = WORKHOURS.map((item) => {
      const [hour, time] = item.split(':');

      return {
        hour: Number(hour),
        time: Number(time),
      };
    });

    return workhours;
  }

  async getAllEnabled() {
    return await this.prisma.workhour.findMany();
  }

  async isEnabled(payload: Workhour) {
    return this.prisma.workhour.findFirst({
      where: {
        hour: payload.hour,
        time: payload.time,
        weekday: payload.weekday,
      },
    });
  }

  async enable(payload: Workhour) {
    return this.prisma.workhour.create({ data: payload });
  }

  async disable(id: Workhour['id']) {
    return this.prisma.workhour.delete({
      where: { id },
    });
  }
}
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

type TWeekdayWithWorkhours = {
  weekday: number;
  workhours: Partial<Workhour>[];
};

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
    const enabledWorkhours = await this.prisma.workhour.findMany();
    const groupedByWeekday: TWeekdayWithWorkhours[] = enabledWorkhours.reduce(
      (acc: TWeekdayWithWorkhours[], curr: Workhour) => {
        let day = acc.find((d) => d.weekday === curr.weekday);
        if (!day) {
          day = { weekday: curr.weekday, workhours: [] };
          acc.push(day);
        }
        day.workhours.push({ id: curr.id, hour: curr.hour, time: curr.time });

        return acc;
      },
      [],
    );

    groupedByWeekday.forEach((item) => {
      item.workhours.sort((a, b) => {
        if (a.hour === b.hour) return a.time - b.time;
        return a.hour - b.hour;
      });
    });

    return groupedByWeekday.sort((a, b) => a.weekday - b.weekday);
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

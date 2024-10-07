import {
  Controller,
  Get,
  ServiceUnavailableException,
  Version,
} from '@nestjs/common';

import { DateTime } from 'luxon';
import { ReservesService } from 'src/reserves/reserves.service';
import { WeekdaysService } from './weekdays.service';
import { WorkhoursService } from 'src/workhours/workhours.service';

@Controller('weekdays')
export class WeekdaysController {
  constructor(
    private readonly service: WeekdaysService,
    private readonly workhoursService: WorkhoursService,
    private readonly reservesService: ReservesService,
  ) {}

  @Version('1')
  @Get()
  async getAllWithWorkhours() {
    try {
      return await this.workhoursService.getAllEnabled();
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }
      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }

  @Version('1')
  @Get('unavailable-workhours')
  async getAllWithUnavailabeWorkhours() {
    try {
      const enabledWorkhours = await this.workhoursService.getAllEnabled();
      const assignedReserves = await this.reservesService.getAllFromNow();

      return enabledWorkhours.map((weekday) => {
        const reservesOfWeekday = assignedReserves.filter((reserve) => {
          const jsDate = new Date(reserve.date);
          const date = DateTime.fromJSDate(jsDate).setZone(
            'America/Argentina/Buenos_Aires',
          );
          return weekday.weekday === date.weekday;
        });

        return {
          ...weekday,
          reserves: reservesOfWeekday,
        };
      });
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }
      throw new ServiceUnavailableException(
        'No se pudo establecer la conexión con la base de datos.',
      );
    }
  }
}

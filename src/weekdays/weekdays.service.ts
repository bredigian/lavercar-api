import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class WeekdaysService {
  constructor(private prisma: PrismaService) {}
}

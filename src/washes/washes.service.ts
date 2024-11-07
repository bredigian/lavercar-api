import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { WashingDto } from './washes.dto';
import { WashingType } from '@prisma/client';

@Injectable()
export class WashesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.washingType.findMany();
  }

  async create(payload: WashingDto) {
    return await this.prisma.washingType.create({ data: payload });
  }

  async updateById(payload: WashingType) {
    return await this.prisma.washingType.update({
      where: { id: payload.id },
      data: payload,
    });
  }

  async deleteById(id: WashingType['id']) {
    return await this.prisma.washingType.delete({ where: { id } });
  }
}

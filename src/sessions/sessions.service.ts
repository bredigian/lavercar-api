import { Session, User } from '@prisma/client';

import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class SessionsService {
  private MAX_CONCURRENT_SESSIONS = 3;

  constructor(private prisma: PrismaService) {}

  async getSessionById(id: Session['id']) {
    return await this.prisma.session.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, first_name: true, last_name: true } },
      },
    });
  }

  async createSession(
    access_token: Session['token'],
    user_id: Session['user_id'],
  ) {
    return await this.prisma.session.create({
      data: {
        token: access_token,
        user_id,
        expire_in: DateTime.now().plus({ days: 30 }).toUTC().toISO(),
      },
    });
  }

  async deleteSessionById(id: Session['id']) {
    return await this.prisma.session.delete({ where: { id } });
  }

  getMaxConcurrentSessionsValue() {
    return this.MAX_CONCURRENT_SESSIONS;
  }

  async verifySessionsByUserId(id: User['id']) {
    const sessionsQuantity = await this.prisma.session.count({
      where: { user_id: id },
    });
    if (sessionsQuantity < 3) return true;

    return false;
  }

  async clearExpiredSessions(id: User['id']) {
    await this.prisma.session.deleteMany({
      where: {
        user_id: id,
        expire_in: { lte: DateTime.now().toUTC().toJSDate() },
      },
    });
  }
}

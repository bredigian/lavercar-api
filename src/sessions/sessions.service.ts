import { Session, User } from '@prisma/client';

import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class SessionsService {
  private MAX_CONCURRENT_SESSIONS = 3;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getSessionByToken(token: Session['token']) {
    return await this.prisma.session.findUnique({
      where: { token },
      include: {
        user: { select: { username: true, first_name: true, last_name: true } },
      },
    });
  }

  async createSession(
    access_token: Session['token'],
    user_id: Session['user_id'],
  ) {
    const { exp } = await this.jwtService.decode(access_token);
    const expires_in = DateTime.fromMillis(exp * 1000)
      .toUTC()
      .toISO();

    console.log(expires_in);

    return await this.prisma.session.create({
      data: {
        token: access_token,
        user_id,
        expire_in: expires_in,
      },
    });
  }

  async deleteSessionByToken(token: Session['token']) {
    return await this.prisma.session.delete({ where: { token } });
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

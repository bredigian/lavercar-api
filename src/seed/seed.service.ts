import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/services/prisma.service';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async seedAdminUser() {
    const payload: Partial<User> = {
      username: 'admin',
      password: 'admin',
      first_name: 'LaveCAR',
      last_name: 'Admin',
    };

    const ADMIN = await this.prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (!ADMIN) {
      const hash_pass = await hash(payload.password, 10);
      const { username, first_name, last_name } = payload;

      await this.prisma.user.create({
        data: { username, first_name, last_name, password: hash_pass },
      });

      this.logger.log('ADMIN USER CREATED!');
    }
  }
}

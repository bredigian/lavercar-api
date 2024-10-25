import { HashService } from 'src/services/hash.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  async findByUsername(username: User['username']) {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async verifyPassword(password: User['password'], hash: User['password']) {
    return await this.hashService.compareHash(password, hash);
  }
}

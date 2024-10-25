import { compare, hash } from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class HashService {
  private SALT_ROUNDS = 10;

  constructor() {}

  async generateHash(payload: string) {
    return await hash(payload, this.SALT_ROUNDS);
  }

  async compareHash(password: string, hash: User['password']) {
    return await compare(password, hash);
  }
}

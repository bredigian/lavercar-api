import { User } from '@prisma/client';

export type TAuth = {
  username: User['username'];
  password: User['password'];
};

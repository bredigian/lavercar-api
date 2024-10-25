import { HashService } from 'src/services/hash.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from './user.service';

@Module({
  providers: [UserService, PrismaService, HashService],
})
export class UserModule {}

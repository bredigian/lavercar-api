import { AuthController } from './auth.controller';
import { HashService } from 'src/services/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, SessionsService, PrismaService, HashService],
})
export class AuthModule {}

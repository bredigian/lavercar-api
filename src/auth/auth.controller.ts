import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
  Version,
} from '@nestjs/common';

import { TAuth } from 'src/types/auth.types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { Session } from '@prisma/client';
import { DateTime } from 'luxon';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}

  @Version('1')
  @Post()
  async signin(@Body() payload: TAuth) {
    try {
      console.log(payload);
      const { username, password } = payload;
      const exists = await this.usersService.findByUsername(username);
      if (!exists) throw new BadRequestException('El usuario no existe.');

      const matchPassword = await this.usersService.verifyPassword(
        password,
        exists.password,
      );
      if (!matchPassword)
        throw new UnauthorizedException('Las credenciales son incorrectas.');

      const { id, first_name, last_name } = exists;

      await this.sessionsService.clearExpiredSessions(id);

      const canSignin = await this.sessionsService.verifySessionsByUserId(id);
      if (!canSignin)
        throw new ForbiddenException(
          'Puedes iniciar sesión en hasta 3 dispositivos al mismo tiempo.',
        );

      const access_token = await this.jwtService.signAsync({
        sub: id,
        username,
        first_name,
        last_name,
      });

      const session = await this.sessionsService.createSession(
        access_token,
        id,
      );

      return {
        token_id: session.id,
        expires_in: session.expire_in,
        userdata: { username, first_name, last_name },
      };
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no está disponible. Intente nuevamente mas tarde.',
      );
    }
  }

  @Version('1')
  @Post('session')
  async verifySession(@Body() payload: { token_id: Session['id'] }) {
    try {
      const { token_id } = payload;
      if (!token_id)
        throw new UnauthorizedException('El ID del token es requerido.');

      const session = await this.sessionsService.getSessionById(token_id);
      if (!session)
        throw new NotFoundException('La sesión no existe o ya expiró.');

      const { token, expire_in, user } = session;
      if (
        DateTime.fromJSDate(new Date(expire_in)).toMillis() <
        DateTime.now().toMillis()
      ) {
        await this.sessionsService.deleteSessionById(token_id);
        throw new UnauthorizedException('La sesión ha expirado.');
      }

      const isValid = await this.jwtService.verifyAsync(token);
      if (!isValid) throw new UnauthorizedException('La sesión ha expirado');

      const { username, first_name, last_name } = user;

      return {
        token_id,
        expires_in: expire_in,
        userdata: { username, first_name, last_name },
      };
    } catch (e) {
      if (e) {
        console.error(e);
        throw e;
      }

      throw new ServiceUnavailableException(
        'El servicio no está disponible. Intente nuevamente mas tarde.',
      );
    }
  }
}

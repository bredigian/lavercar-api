import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
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
        access_token,
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
  @Get('session')
  async verifySession(@Headers('Authorization') authorization: string) {
    try {
      const access_token = authorization?.substring(7);
      if (!access_token)
        throw new UnauthorizedException('El token de acceso es requerido.');

      const session =
        await this.sessionsService.getSessionByToken(access_token);
      if (!session)
        throw new NotFoundException('La sesión no existe o ya expiró.');

      const { token, expire_in, user } = session;
      if (
        DateTime.fromJSDate(new Date(expire_in)).toMillis() <
        DateTime.now().toMillis()
      ) {
        await this.sessionsService.deleteSessionByToken(access_token);
        throw new UnauthorizedException('La sesión ha expirado.');
      }

      const isValid = await this.jwtService.verifyAsync(token);
      if (!isValid) throw new UnauthorizedException('La sesión ha expirado');

      const { username, first_name, last_name } = user;

      return {
        access_token: token,
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

  @Version('1')
  @Delete('session')
  async signout(@Headers('Authorization') authorization: string) {
    try {
      const access_token = authorization.substring(7);
      return await this.sessionsService.deleteSessionByToken(access_token);
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

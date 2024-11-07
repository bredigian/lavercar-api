import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { RESERVE_STATUS, Reserve, WashingType } from '@prisma/client';

export class ReserveByDateDto {
  @IsDateString({}, { message: 'La fecha no es válida.' })
  date: string;
}

export class ReserveDto {
  @IsDateString({}, { message: 'La fecha no es válida.' })
  date: Date;

  @IsOptional()
  @IsEmail()
  user_email?: string;

  @IsString()
  user_name: string;

  @IsPhoneNumber('AR', {
    message: 'El núm. de teléfono debe contener +54 (Argentina)',
  })
  user_phone: string;

  @IsString()
  status: 'PENDING';

  @IsString()
  payment_status: 'PENDING';

  @IsUUID()
  washing_id: WashingType['id'];
}

export class ReserveDetailDto {
  @IsOptional()
  @IsUUID()
  id?: Reserve['id'];

  @IsOptional()
  @IsNumberString()
  number?: Reserve['number'];
}

export class UpdateReserveDto {
  @IsUUID()
  id: Reserve['id'];

  @IsEnum(RESERVE_STATUS)
  status: Reserve['status'];
}

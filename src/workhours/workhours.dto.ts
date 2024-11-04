import { IsNumber, IsOptional, IsUUID } from 'class-validator';

import { UUID } from 'crypto';

export class EnableWorkhourDto {
  @IsOptional()
  @IsUUID()
  id?: UUID;

  @IsNumber()
  hour: number;

  @IsNumber()
  time: number;

  @IsNumber()
  weekday: number;
}

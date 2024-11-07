import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class WashingDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumberString()
  price: number;
}

import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // min độ dài của password
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNumber()
  @Optional()
  created_by?: number;
}

import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleId: number;

  @IsString()
  @Optional()
  updatedBy?: string;
}

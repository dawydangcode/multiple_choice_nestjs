import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  username!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  accountId!: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class CreateAccountBodyDto extends PickType(AccountDto, [
  'username',
  'password',
  'email',
  'roleId',
]) {}

export class UpdateAccountBodyDto extends PartialType(
  PickType(AccountDto, ['username', 'password']),
) {}

export class GetAccountParamsDto extends PickType(AccountDto, ['accountId']) {}

export class UpdateAccountParamsDto extends PickType(AccountDto, [
  'accountId',
]) {}

export class GetAccountsQueryDto extends PartialType(
  PickType(AccountDto, ['limit', 'page', 'q']),
) {}

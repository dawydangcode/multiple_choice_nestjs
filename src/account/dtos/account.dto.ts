import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsString()
  @Max(32)
  @Min(8)
  username!: string;

  @ApiProperty()
  @IsString()
  @Max(32)
  @Min(8)
  password!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  accountId!: number;
}

export class CreateAccountBodyDto extends PickType(AccountDto, [
  'username',
  'password',
  'roleId',
]) {}

export class UpdateAccountBodyDto extends PartialType(
  PickType(AccountDto, ['username', 'password']),
) {}

export class CreateAccountBodyTestDto extends IntersectionType(
  PickType(AccountDto, ['username']),
  PartialType(PickType(AccountDto, ['password'])),
) {}

export class GetAccountParamsDto extends PickType(AccountDto, ['accountId']) {}

export class UpdateAccountParamsDto extends PickType(AccountDto, [
  'accountId',
]) {}

import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { GenderType } from '../enums/gender.type';

export class AccountDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  accountDetailId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  accountId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsDate()
  dob!: Date;

  @ApiProperty()
  @IsEnum(GenderType)
  gender!: GenderType;

  @ApiProperty()
  @IsString()
  imageUrl!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class CreateAccountDetailBodyDto extends PickType(AccountDetailDto, [
  'accountId',
  'name',
  'dob',
  'gender',
  'imageUrl',
]) {}

export class GetAccountDetailParamsDto extends PickType(AccountDetailDto, [
  'accountDetailId',
]) {}

export class UpdateAccountDetailBodyDto extends PickType(AccountDetailDto, [
  'accountId',
  'name',
  'dob',
  'gender',
  'imageUrl',
]) {}

export class UpdateAccountDetailParamsDto extends PickType(AccountDetailDto, [
  'accountDetailId',
]) {}

export class GetAccountDetailByAccountIdParamsDto extends PickType(
  AccountDetailDto,
  ['accountId'],
) {}

export class GetAccountDetailsQueryDto extends PartialType(
  PickType(AccountDetailDto, ['page', 'limit', 'q']),
) {}

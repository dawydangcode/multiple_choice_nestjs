import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

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
  @IsDateString()
  dob!: string;

  @ApiProperty()
  @IsString()
  gender!: string;

  @ApiProperty()
  @IsString()
  imageUrl!: string;
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

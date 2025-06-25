import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  username!: string;

  @ApiProperty()
  @IsString()
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
  @IsNumber()
  sessionId!: number;

  @ApiProperty()
  @IsString()
  accessToken!: string;

  @ApiProperty()
  @IsString()
  refreshToken!: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  reqAccountId?: number;

  @ApiProperty()
  @IsString()
  payload!: string;
}

export class AuthSignUpBodyDto extends PickType(AuthDto, [
  'username',
  'password',
]) {}

export class AuthSignInBodyDto extends PickType(AuthDto, [
  'username',
  'password',
]) {}

export class ValidateBodyDto extends PickType(AuthDto, [
  'accountId',
  'sessionId',
  'roleId',
]) {}

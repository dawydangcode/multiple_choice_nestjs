import { ApiProperty, PickType } from '@nestjs/swagger';
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
  accessToken?: string;

  @ApiProperty()
  @IsString()
  refreshToken?: string;
}

export class AuthSignUpBodyDto extends PickType(AuthDto, [
  'username',
  'password',
  'roleId',
]) {}

export class AuthSignInBodyDto extends PickType(AuthDto, [
  'username',
  'password',
]) {}
export class AuthLogoutBodyDto extends PickType(AuthDto, ['sessionId']) {}
export class RefreshTokenBodyDto extends PickType(AuthDto, []) {}

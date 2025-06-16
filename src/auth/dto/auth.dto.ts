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
}
export class AuthSignUpParamsDto extends PickType(AuthDto, ['accountId']) {}

export class AuthSignUpBodyDto extends PickType(AuthDto, [
  'username',
  'password',
  'roleId',
]) {}

export class AuthSignInDto extends PickType(AuthDto, [
  'username',
  'password',
]) {}

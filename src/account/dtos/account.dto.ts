import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsString()
  @Max(32)
  @Min(8)
  username: string;

  @ApiProperty()
  @IsString()
  @Max(32)
  @Min(8)
  password: string;
}

export class CreateAccountBodyDto extends PickType(AccountDto, [
  'username',
  'password',
]) {}

export class UpdateAccountBodyDto extends PartialType(
  PickType(AccountDto, ['username', 'password']),
) {}

export class CreateAccountBodyTestDto extends IntersectionType(
  PickType(AccountDto, ['username']),
  PartialType(PickType(AccountDto, ['password'])),
) {}

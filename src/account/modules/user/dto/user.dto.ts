import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { GenderType } from '../../account-detail/enums/gender.type';

export class UserDto {
  @ApiProperty()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @Type(() => Number)
  accountId!: number;

  @ApiProperty()
  @IsString()
  cvUrl!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob!: Date;

  @ApiProperty()
  @IsEnum(GenderType)
  gender!: GenderType;

  @ApiProperty()
  @IsString()
  imageUrl!: string;
}

export class GetUserProfileParamDto extends PickType(UserDto, ['accountId']) {}

export class UploadCVBodyDto extends PickType(UserDto, ['cvUrl']) {}

export class UpdateProfileBodyDto extends PickType(UserDto, [
  'name',
  'dob',
  'gender',
  'imageUrl',
]) {}

export class UpdateProfileParamsDto extends PickType(UserDto, ['accountId']) {}

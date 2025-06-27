import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

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
}

export class GetUserProfileParamDto extends PickType(UserDto, ['accountId']) {}

export class UploadCVBodyDto extends PickType(UserDto, ['cvUrl']) {}

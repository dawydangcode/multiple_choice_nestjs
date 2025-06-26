import { ApiProperty } from '@nestjs/swagger';
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

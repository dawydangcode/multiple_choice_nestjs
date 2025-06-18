import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty()
  @Type(() => Number)
  id!: number;

  accountId!: number;

  sessionId!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isRevoke?: string;
}

export class CreateSessionBodyDto extends PickType(SessionDto, [
  'accountId',
  'sessionId',
  'ipAddress',
  'userAgent',
  'isRevoke',
]) {}

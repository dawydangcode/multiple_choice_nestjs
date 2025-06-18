import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty()
  @Type(() => Number)
  accountId!: number;

  @ApiProperty()
  @Type(() => Number)
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

export class GetSessionParamsDto extends PickType(SessionDto, ['sessionId']) {}

export class Request extends PickType(SessionDto,[]){}

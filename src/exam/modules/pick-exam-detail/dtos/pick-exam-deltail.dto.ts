import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PickExamDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  answerId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  reqAccountId!: number;
}

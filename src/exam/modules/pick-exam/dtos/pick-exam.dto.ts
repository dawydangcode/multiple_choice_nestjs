import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import e from 'express';
import { PickExamType } from '../enum/pick-exam.type';
import { extend } from 'lodash';

export class PickExamDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  pickExamId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  examId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @ApiProperty()
  @IsString()
  status!: PickExamType;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  reqAccountId!: number;
}

export class GetPickExamByIdBodyDto extends PickType(PickExamDto, [
  'pickExamId',
]) {}

export class GetPickExamByUserIdBodyDto extends PickType(PickExamDto, [
  'examId',
  'userId',
]) {}

export class StartPickExamBodyDto extends PickType(PickExamDto, ['examId']) {}

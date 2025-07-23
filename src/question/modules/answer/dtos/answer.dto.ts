import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator';
import { extend } from 'lodash';

export class AnswerDto {
  @ApiProperty()
  @Type(() => Number)
  answerId!: number;

  @ApiProperty()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetAnswerParamsDto extends PickType(AnswerDto, ['answerId']) {}

export class CreateAnswerBodyDto extends PickType(AnswerDto, [
  'questionId',
  'content',
  'isCorrect',
]) {}

export class UpdateAnswerBodyDto extends PartialType(
  PickType(AnswerDto, ['questionId', 'content', 'isCorrect']),
) {}

export class UpdateAnswerParamsDto extends PickType(AnswerDto, ['answerId']) {}

export class GetAnswersQueryDto extends PartialType(
  PickType(AnswerDto, ['page', 'limit', 'q']),
) {}

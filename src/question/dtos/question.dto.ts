import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class QuestionDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  questionId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  topicId!: number;

  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  points!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  reqAccountId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetQuestionParamsDto extends PickType(QuestionDto, [
  'questionId',
]) {}

export class GetQuestionByTopicParamsDto extends PickType(QuestionDto, [
  'topicId',
]) {}

export class UpdateQuestionParamsDto extends PickType(QuestionDto, [
  'questionId',
]) {}

export class CreateQuestionBodyDto extends PickType(QuestionDto, [
  'topicId',
  'content',
  'points',
]) {}

export class UpdateQuestionBodyDto extends PartialType(
  PickType(QuestionDto, ['topicId', 'content', 'points']),
) {}

export class GetQuestionsQueryDto extends PartialType(
  PickType(QuestionDto, ['q', 'page', 'limit']),
) {}

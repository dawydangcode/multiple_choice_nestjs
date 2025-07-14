import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class QuestionDto {
  @ApiProperty()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @Type(() => Number)
  topicId!: number;

  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty()
  @Type(() => Number)
  points!: number;

  @ApiProperty()
  @Type(() => Number)
  reqAccountId!: number;
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

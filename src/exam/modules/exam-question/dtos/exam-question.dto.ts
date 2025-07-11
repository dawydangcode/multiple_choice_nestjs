import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { extend } from 'lodash';

export class ExamQuestionDto {
  @ApiProperty()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  questionIds!: number[];

  @ApiProperty()
  @Type(() => Number)
  examId!: number;
}

export class AddQuestionToExamParamsDto extends PickType(ExamQuestionDto, [
  'examId',
]) {}

export class AddQuestionsToExamBodyDto extends PickType(ExamQuestionDto, [
  'questionIds',
]) {
  constructor(partial: Partial<AddQuestionsToExamBodyDto>) {
    super();
    extend(this, partial);
  }
}

export class RemoveQuestionFromExamParamsDto extends PickType(ExamQuestionDto, [
  'questionId',
  'examId',
]) {}

export class GetQuestionByExamParamsDto extends PickType(ExamQuestionDto, [
  'examId',
]) {}

export class GetExamsByQuestionParamsDto extends PickType(ExamQuestionDto, [
  'questionId',
]) {}

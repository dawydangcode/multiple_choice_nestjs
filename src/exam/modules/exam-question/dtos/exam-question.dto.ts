import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExamQuestionDto {
  @ApiProperty()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @Type(() => Number)
  examId!: number;
}

export class AddQuestionToExamParamsDto extends PickType(ExamQuestionDto, [
  'questionId',
  'examId',
]) {}

export class AddQuestionsToExamBodyDto extends PickType(ExamQuestionDto, [
  'questionId',
  'examId',
]) {}

export class RemoveQuestionFromExamParamsDto extends PickType(ExamQuestionDto, [
  'questionId',
  'examId',
]) {}

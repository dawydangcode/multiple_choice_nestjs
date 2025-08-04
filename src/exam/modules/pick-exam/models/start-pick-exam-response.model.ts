import { ApiProperty } from '@nestjs/swagger';
import { PickExamModel } from './pick-exam.model';

export class ExamAnswerModel {
  @ApiProperty({ description: 'ID của câu trả lời', example: 1 })
  public readonly questionId: number;

  @ApiProperty({
    description: 'Nội dung câu trả lời',
    example: 'A programming language',
  })
  public readonly content: string;

  constructor(questionId: number, content: string) {
    this.questionId = questionId;
    this.content = content;
  }
}

export class ExamQuestionModel {
  @ApiProperty()
  public readonly questionId: number;

  @ApiProperty()
  public readonly content: string;

  @ApiProperty()
  public readonly points: number;

  @ApiProperty()
  public readonly topicId: number;

  @ApiProperty()
  public readonly answers: ExamAnswerModel[];

  constructor(
    questionId: number,
    content: string,
    points: number,
    topicId: number,
    answers: ExamAnswerModel[],
  ) {
    this.questionId = questionId;
    this.content = content;
    this.points = points;
    this.topicId = topicId;
    this.answers = answers;
  }
}

export class StartPickExamResponseModel {
  @ApiProperty()
  public readonly pickExam: PickExamModel;

  @ApiProperty()
  public readonly questions: ExamQuestionModel[];

  @ApiProperty()
  public readonly totalQuestions: number;

  @ApiProperty()
  public readonly startTime: Date;

  @ApiProperty()
  public readonly endTime: Date;

  @ApiProperty()
  public readonly remainingTime: number;

  constructor(
    pickExam: PickExamModel,
    questions: ExamQuestionModel[],
    totalQuestions: number,
    startTime: Date,
    endTime: Date,
    remainingTime: number,
  ) {
    this.pickExam = pickExam;
    this.questions = questions;
    this.totalQuestions = totalQuestions;
    this.startTime = startTime;
    this.endTime = endTime;
    this.remainingTime = remainingTime;
  }
}

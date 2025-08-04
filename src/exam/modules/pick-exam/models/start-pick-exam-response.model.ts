import { ApiProperty } from '@nestjs/swagger';
import { PickExamModel } from './pick-exam.model';

export class ExamAnswerModel {
  public readonly questionId: number;
  public readonly content: string;

  constructor(questionId: number, content: string) {
    this.questionId = questionId;
    this.content = content;
  }
}

export class ExamQuestionModel {
  public readonly questionId: number;
  public readonly content: string;
  public readonly points: number;
  public readonly topicId: number;
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
  public readonly pickExam: PickExamModel;
  public readonly questions: ExamQuestionModel[];
  public readonly totalQuestions: number;
  public readonly startTime: Date;
  public readonly endTime: Date;
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

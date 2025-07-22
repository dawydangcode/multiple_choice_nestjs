import { ExamModel } from './exam.model';

export class ExamQuestionAnswerModel {
  public readonly exam: ExamModel;
  public readonly questions: ExamQuestionResponse[];
  public readonly totalQuestions: number;

  constructor(
    exam: ExamModel,
    questions: ExamQuestionResponse[],
    totalQuestions: number,
  ) {
    this.exam = exam;
    this.questions = questions;
    this.totalQuestions = totalQuestions;
  }
}

export class ExamAnswerResponse {
  public readonly id!: number;
  public readonly content!: string;
  isCorrect!: boolean;
}

export class ExamQuestionResponse {
  public readonly id!: number;
  public readonly content!: string;
  public readonly points!: number;
  public readonly topicId!: number;
  public readonly answers!: ExamAnswerResponse[];
}

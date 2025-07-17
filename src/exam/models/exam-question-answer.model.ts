import { ExamModel } from './exam.model';

export class ExamQuestionAnswerModel {
  public readonly exam: ExamModel;
  public readonly questions: ExamQuestionResponse[];
  public readonly totalQuestions: number;
  public readonly totalPoints: number;
  public readonly averagePoints: number;

  constructor(
    exam: ExamModel,
    questions: ExamQuestionResponse[],
    totalQuestions: number,
    totalPoints: number,
    averagePoints: number,
  ) {
    this.exam = exam;
    this.questions = questions;
    this.totalQuestions = totalQuestions;
    this.totalPoints = totalPoints;
    this.averagePoints = averagePoints;
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

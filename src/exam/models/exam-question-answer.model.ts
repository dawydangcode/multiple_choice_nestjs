import { ExamQuestionModel } from './exam-question.model';
import { ExamModel } from './exam.model';

export class ExamQuestionAnswerModel {
  public readonly exam: ExamModel;
  public readonly questions: ExamQuestionModel[];
  public readonly totalQuestions: number;
  public readonly totalPoints: number;
  public readonly averagePoints: number;

  constructor(
    exam: ExamModel,
    questions: ExamQuestionModel[],
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

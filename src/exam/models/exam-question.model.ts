import { ExamAnswerModel } from './exam-answer.model';

export class ExamQuestionModel {
  public readonly id!: number;
  public readonly content!: string;
  public readonly points!: number;
  public readonly topicId!: number;
  public readonly answers!: ExamAnswerModel[];
}

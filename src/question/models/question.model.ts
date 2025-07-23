import { AnswerModel } from '../modules/answer/models/answer.model';

export class QuestionModel {
  public readonly id: number;
  public readonly topicId: number;
  public readonly content: string;
  public readonly points: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;
  public readonly answers: AnswerModel[] | undefined;
  public readonly question: QuestionModel | undefined;

  constructor(
    id: number,
    topicId: number,
    content: string,
    points: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
    answers: AnswerModel[] | undefined,
  ) {
    this.id = id;
    this.topicId = topicId;
    this.content = content;
    this.points = points;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.answers = answers;
  }
}

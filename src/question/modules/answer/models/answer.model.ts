export class AnswerModel {
  public readonly id: number;
  public readonly questionId: number;
  public readonly content: string;
  public readonly isCorrect: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;

  constructor(
    id: number,
    questionId: number,
    content: string,
    isCorrect: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.questionId = questionId;
    this.content = content;
    this.isCorrect = isCorrect;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
  public readonly deletedBy: number | undefined;
}

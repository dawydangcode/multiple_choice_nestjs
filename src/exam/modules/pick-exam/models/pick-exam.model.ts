import { PickExamType } from '../enum/pick-exam.type';

export class PickExamModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly examId: number;
  public readonly status: PickExamType;
  public readonly startTime: Date | undefined;
  public readonly endTime: Date | undefined;
  public readonly finishTime: Date | undefined;
  public readonly totalQuestions: number | undefined;
  public readonly correctAnswers: number | undefined;
  public readonly score: number | undefined;
  public readonly percentage: number | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    userId: number,
    examId: number,
    status: PickExamType,
    startTime: Date | undefined,
    endTime: Date | undefined,
    finishTime: Date | undefined,
    totalQuestions: number | undefined,
    correctAnswers: number | undefined,
    score: number | undefined,
    percentage: number | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.examId = examId;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
    this.finishTime = finishTime;
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.score = score;
    this.percentage = percentage;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}

export class ScoreModel {
  public readonly pickExamId: number;
  public readonly totalQuestions: number;
  public readonly correctAnswers: number;
  public readonly score: number;
  public readonly percentage: number;

  constructor(
    pickExamId: number,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    percentage: number,
  ) {
    this.pickExamId = pickExamId;
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.score = score;
    this.percentage = percentage;
  }
}

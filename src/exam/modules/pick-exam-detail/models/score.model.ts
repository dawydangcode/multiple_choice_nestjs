export class ScoreModel {
  public readonly totalQuestions: number;
  public readonly correctAnswers: number;
  public readonly score: number;
  public readonly percentage: number;

  constructor(
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    percentage: number,
  ) {
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.score = score;
    this.percentage = percentage;
  }
}

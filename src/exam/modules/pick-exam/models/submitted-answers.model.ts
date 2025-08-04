export class SubmittedAnswerModel {
  public readonly questionId: number;
  public readonly answerId: number;

  constructor(questionId: number, answerId: number) {
    this.questionId = questionId;
    this.answerId = answerId;
  }
}

export class SubmittedAnswersModel {
  public readonly answers: SubmittedAnswerModel[];

  constructor(answers: SubmittedAnswerModel[]) {
    this.answers = answers;
  }
}

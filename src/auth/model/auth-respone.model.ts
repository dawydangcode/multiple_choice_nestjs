export class AuthResponseModel {
  public readonly resetToken: string;
  public readonly message: string | undefined;
  public readonly email: string;
  public readonly accountId: number;

  constructor(
    resetToken: string,
    message: string | undefined,
    email: string,
    accountId: number,
  ) {
    this.resetToken = resetToken;
    this.message = message;
    this.email = email;
    this.accountId = accountId;
  }
}

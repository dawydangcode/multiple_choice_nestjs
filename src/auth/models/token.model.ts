export class TokenModel {
  public readonly accountId: number;
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly accessExpireDate: Date;
  public readonly refreshExpireDate: Date;

  constructor(
    accountId: number,
    accessToken: string,
    refreshToken: string,
    accessExpireDate: Date,
    refreshExpireDate: Date,
  ) {
    this.accountId = accountId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessExpireDate = accessExpireDate;
    this.refreshExpireDate = refreshExpireDate;
  }
}

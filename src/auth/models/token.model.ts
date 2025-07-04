export class TokenModel {
  accountId: number;
  accessToken: string;
  refreshToken: string;
  accessExpireDate: Date;
  refreshExpireDate: Date;

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

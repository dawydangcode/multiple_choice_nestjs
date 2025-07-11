import { TokenModel } from './token.model';

export class LoginTokenModel {
  public readonly accountId: number;
  public readonly accessToken: TokenModel;
  public readonly refreshToken: TokenModel;

  constructor(
    accountId: number,
    accessToken: TokenModel,
    refreshToken: TokenModel,
  ) {
    this.accountId = accountId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

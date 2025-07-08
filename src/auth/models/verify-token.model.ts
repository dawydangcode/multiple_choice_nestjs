export class VerificationTokenModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly email: string;
  public readonly token: string;
  public readonly ipAddress: string | undefined;
  public readonly userAgent: string | undefined;
  public readonly isUsed: boolean;
  public readonly createdAt: Date | undefined;
  public readonly expiresAt: Date | undefined;
  public readonly deletedAt: Date | undefined;

  constructor(
    id: number,
    accountId: number,
    email: string,
    token: string,
    ipAddress: string | undefined,
    userAgent: string | undefined,
    isUsed: boolean,
    createdAt: Date | undefined,
    expiresAt: Date | undefined,
    deletedAt: Date | undefined,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.email = email;
    this.token = token;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.isUsed = isUsed;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.deletedAt = deletedAt;
  }
}

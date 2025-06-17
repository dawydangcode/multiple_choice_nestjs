export class TokenModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly expiresAt: Date;
  public readonly refreshExpiresAt: Date;
  public readonly isRevoked: boolean;
  public readonly userAgent: string | undefined;
  public readonly ipAddress: string | undefined;
  public readonly sessionId: string | undefined;
  public readonly lastUsedAt: Date | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    accountId: number,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
    refreshExpiresAt: Date,
    isRevoked: boolean,
    userAgent: string | undefined,
    ipAddress: string | undefined,
    sessionId: string | undefined,
    lastUsedAt: Date | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
    this.refreshExpiresAt = refreshExpiresAt;
    this.isRevoked = isRevoked;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.sessionId = sessionId;
    this.lastUsedAt = lastUsedAt;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}

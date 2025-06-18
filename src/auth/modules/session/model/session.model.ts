export class SessionModel {
  public readonly id: number;
  public readonly sessionId: number;
  public readonly accountId: number;
  public readonly userAgent: string;
  public readonly ipAddress: string;
  public readonly isRevoke: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;

  constructor(
    id: number,
    sessionId: number,
    accountId: number,
    userAgent: string,
    ipAddress: string,
    isRevoke: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.sessionId = sessionId;
    this.accountId = accountId;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.isRevoke = isRevoke;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }

  public readonly deletedBy: number | undefined;
}

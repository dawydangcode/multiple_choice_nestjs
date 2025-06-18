export class SessionModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly isRevoked: boolean;
  public readonly userAgent: string | undefined;
  public readonly ipAddress: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;

  constructor(
    id: number,
    accountId: number,
    isRevoked: boolean,
    userAgent: string | undefined,
    ipAddress: string | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.isRevoked = isRevoked;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }

  public readonly deletedBy: number | undefined;
}

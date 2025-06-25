export class SessionModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly roleId: number;
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly accessExpire: Date | undefined;
  public readonly refreshExpire: Date | undefined;
  public readonly isActive: boolean;
  public readonly userAgent: string | undefined;
  public readonly ipAddress: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: Number | undefined;

  constructor(
    id: number,
    accountId: number,
    roleId: number,
    accessToken: string,
    refreshToken: string,
    accessExpire: Date | undefined,
    refreshExpire: Date | undefined,
    isActive: boolean,
    userAgent: string | undefined,
    ipAddress: string | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: Number | undefined,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.roleId = roleId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessExpire = accessExpire;
    this.refreshExpire = refreshExpire;
    this.isActive = isActive;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}

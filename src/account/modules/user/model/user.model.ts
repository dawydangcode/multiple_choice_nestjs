export class UserModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly cvUrl: string | undefined;
  public readonly createAt: Date | undefined;
  public readonly createBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    accountId: number,
    cvUrl: string | undefined,
    createAt: Date | undefined,
    createBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.cvUrl = cvUrl;
    this.createAt = createAt;
    this.createBy = createBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}

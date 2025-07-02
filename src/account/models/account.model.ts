import { RoleType } from 'src/role/enum/role.enum';

export class AccountModel {
  public readonly id: number;
  public readonly username: string;
  public readonly password: string | undefined;
  public readonly email: string;
  public readonly roleId: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    username: string,
    password: string | undefined,
    email: string,
    roleId: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.roleId = roleId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}

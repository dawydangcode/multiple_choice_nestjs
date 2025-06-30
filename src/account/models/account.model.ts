import { RoleType } from 'src/role/enum/role.enum';

export class AccountModel {
  public readonly id: number;
  public readonly username: string;
  public readonly password: string;
  public readonly email: string;
  public readonly roleId: number;
  public readonly created_at: Date | undefined;
  public readonly created_by: number | undefined;
  public readonly updated_at: Date | undefined;
  public readonly updated_by: number | undefined;
  public readonly deleted_at: Date | undefined;
  public readonly deleted_by: number | undefined;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    roleId: number,
    created_at: Date | undefined,
    created_by: number | undefined,
    updated_at: Date | undefined,
    updated_by: number | undefined,
    deleted_at: Date | undefined,
    deleted_by: number | undefined,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.roleId = roleId;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.deleted_at = deleted_at;
    this.deleted_by = deleted_by;
  }
}

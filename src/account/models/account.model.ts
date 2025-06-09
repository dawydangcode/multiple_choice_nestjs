export class AccountModel {
  public readonly id: number;
  public readonly username: string;
  public readonly password: string;
  public readonly roleId: number;

  constructor(id: number, username: string, password: string, roleId: number) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.roleId = roleId;
  }
}

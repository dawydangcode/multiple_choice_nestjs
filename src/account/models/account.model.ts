export class AccountModel {
  public readonly id: number;
  public readonly username: string;
  public readonly password: string;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

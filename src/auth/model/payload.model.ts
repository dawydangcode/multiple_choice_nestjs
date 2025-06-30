export class PayloadModel {
  public readonly accountId: number;
  public readonly sessionId: number;
  public readonly email: string;
  public readonly roleId: number;
  public readonly role: string;

  constructor(
    accountId: number,
    sessionId: number,
    email: string,
    roleId: number,
    role: string,
  ) {
    this.accountId = accountId;
    this.sessionId = sessionId;
    this.email = email;
    this.roleId = roleId;
    this.role = role;
  }
}

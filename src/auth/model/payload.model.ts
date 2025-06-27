export class PayloadModel {
  public readonly accountId: number;
  public readonly sessionId: number;
  public readonly roleId: number;
  public readonly role: string;

  constructor(
    accountId: number,
    sessionId: number,
    roleId: number,
    role: string,
  ) {
    this.accountId = accountId;
    this.sessionId = sessionId;
    this.roleId = roleId;
    this.role = role;
  }

  toString() {
    return {
      accountId: this.accountId,
      sesssionId: this.sessionId,
      roleId: this.roleId,
      role: this.role,
    };
  }
}

export class PayloadModel {
  accountId: number;
  roleId: number;
  role: string;
  sessionId: number;
  constructor(
    accountId: number,
    sessionId: number,
    roleId: number,
    role: string,
  ) {
    this.accountId = accountId;
    this.roleId = roleId;
    this.role = role;
    this.sessionId = sessionId;
  }
}

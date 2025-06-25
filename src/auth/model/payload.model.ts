export class PayloadModel {
  accountId: number;
  roleId: number;
  sessionId: number;
  constructor(accountId: number, roleId: number, sessionId: number) {
    this.accountId = accountId;
    this.roleId = roleId;
    this.sessionId = sessionId;
  }
}

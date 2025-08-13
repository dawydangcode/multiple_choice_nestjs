export class ResponseModel {
  public readonly code: number;
  public readonly message: string;
  public readonly data: string | undefined;
  public readonly description: string | undefined;

  constructor(code: number, message: string, data?: any, description?: any) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.description = description;
  }
}

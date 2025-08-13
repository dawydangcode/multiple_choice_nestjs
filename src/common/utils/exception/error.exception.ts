import { ErrorCode } from 'src/common/enum/error-code';
import { ResponseModel } from '../models/response.model';

export class ErrorException extends Error {
  public readonly code: number;
  public readonly httpStatusCode: number;
  public readonly description: any;

  constructor(code: ErrorCode, message: string | undefined, description: any) {
    super(message);
    const [errorCode, httpStatusCode] = code.split('|');
    this.code = Number(errorCode);
    this.httpStatusCode = Number(httpStatusCode);
    this.description = description;
  }

  public getErrors(): ResponseModel {
    return new ResponseModel(
      this.code,
      this.message,
      undefined,
      this.description,
    );
  }
}

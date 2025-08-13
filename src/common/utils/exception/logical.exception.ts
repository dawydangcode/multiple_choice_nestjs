import { ErrorCode } from 'src/common/enum/error-code';
import { ErrorException } from './error.exception';

export class LogicalException extends ErrorException {
  constructor(
    code: ErrorCode,
    message: string | undefined,
    description: string | Record<string, string[]> | undefined,
  ) {
    super(code, message, description);
  }
}

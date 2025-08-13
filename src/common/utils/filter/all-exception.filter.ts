import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from 'src/common/enum/error-code';
import { LogicalException } from '../exception/logical.exception';
import { ResponseModel } from '../models/response.model';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof LogicalException) {
      const errorResponse = exception.getErrors();
      response.status(exception.httpStatusCode || 400).json(errorResponse);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      let message = 'Internal server error';
      let code = 500;
      let description = undefined;

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        code = (exceptionResponse as any).errorCode || status;
        description = (exceptionResponse as any).description;
      } else {
        message = exception.message;
      }

      const responseModel = new ResponseModel(
        typeof code === 'string' ? parseInt(code) : code,
        message,
        undefined,
        description || `Request: ${request.method} ${request.url}`,
      );
      response.status(status).json(responseModel);
      return;
    }

    const responseModel = new ResponseModel(
      500,
      'Internal server error',
      undefined,
      `Request: ${request.method} ${request.url}`,
    );
    response.status(500).json(responseModel);
  }
}

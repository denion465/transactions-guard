import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | { response: { message: string } },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      console.error(exception);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      Object.assign(exception, {
        response: {
          message: 'An unexpected error occurred, please try again later',
        },
      });
    }

    response.status(statusCode).json({
      detail:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception.response,
    });
  }
}

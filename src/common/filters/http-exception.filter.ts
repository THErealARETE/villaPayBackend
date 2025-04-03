import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from '../enums';

interface IExceptionResponse {
  errors: Record<string, { message: string }[]> | null;
  message: string;
  state: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponseJson: IExceptionResponse = {
      errors: null,
      message: '',
      state: 'error',
    };
    if (exception.getStatus && exception.getResponse) {
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse['message'];
      const status = exception.getStatus();

      if (status == HttpStatus.BAD_REQUEST) {
        if (Array.isArray(message)) {
          exceptionResponseJson.message = ErrorMessage.BAD_REQUEST;
          exceptionResponseJson.errors = message.reduce(
            (prev, curr: ValidationError) => {
              prev[curr.property] = curr.constraints
                ? Object.values(curr.constraints)
                    .map((constraint) => {
                      return constraint;
                    })
                    .slice(0, 1)
                : [];
              return prev;
            },
            {},
          );
        } else {
          exceptionResponseJson.message = message;
        }
        this.logger.error(
          {
            status,
            exceptionResponse: exceptionResponseJson,
          },
          'HttpExceptionFilter',
        );
        response.status(status).json(exceptionResponseJson);
      } else {
        exceptionResponseJson.message = message || 'Please try again!';
        this.logger.error(
          {
            status,
            exceptionResponse: exceptionResponseJson,
          },
          'HttpExceptionFilter',
        );
        response.status(status).json(exceptionResponseJson);
      }
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionResponseJson.message = ErrorMessage.INTERNAL_SERVER_ERROR;
      this.logger.error(
        {
          status,
          exceptionResponse: {
            ...exceptionResponseJson,
            message: exception.message,
          },
          errorStack: exception.stack,
        },
        'HttpExceptionFilter@ApplicationError',
      );
      response.status(status).json(exceptionResponseJson);
    }
  }
}

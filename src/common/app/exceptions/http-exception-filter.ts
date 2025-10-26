import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ServerErrorResponseDto } from '../dto/server-error-response.dto';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse = exception instanceof HttpException
      ? (exception.getResponse() as any)
      : null;

      const serverErrorResponse: ServerErrorResponseDto = {
      statusCode: status,
      success: false,
      message:
        (errorResponse && errorResponse.message) ||
        exception.message ||
        'Internal server error',
      timestamp: new Date().toISOString(),
      cause:
        exception?.cause?.message ||
        (errorResponse && errorResponse.error) ||
        undefined,
      errorValidations:
        (errorResponse && errorResponse.errorValidations) || undefined,
    };

    // Logging detail error
    this.logger.error(
      `[${request.method}] ${request.url} -> ${status} :: ${serverErrorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(serverErrorResponse);
  }
}

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ServerPaginatedResponseDto,
  ServerResponseDto,
} from '../dto/server-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      map((result: any): ServerResponseDto | ServerPaginatedResponseDto => {
        const res = ctx.switchToHttp().getResponse();
        const statusCode = res.statusCode ?? 200;

        if (
          result &&
          typeof result === 'object' &&
          ('data' in result || 'meta' in result || 'message' in result)
        ) {
          this.logger.log(
            'info',
            JSON.stringify({
              method,
              url,
              statusCode,
              durationMs: `${Date.now() - start}ms`,
              message: result.message ?? 'Success',
              hasMeta: Boolean(result.meta),
              hasData: Boolean(result.data),
            }),
          );

          return {
            statusCode: result.statusCode ?? statusCode,
            success: result.success ?? true,
            message: result.message ?? 'Success',
            ...result,
          };
        }
        const response: ServerResponseDto = {
          statusCode,
          success: true,
          message: 'Success',
          data: result,
        };

        this.logger.log(
          'info',
          JSON.stringify({
            method,
            url,
            statusCode,
            durationMs: `${Date.now() - start}ms`,
            message: response.message,
            hasMeta: false,
            hasData: Boolean(result),
          }),
        );

        return response;
      }),
    );
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { CustomValidationPipe } from './common/app/pipes/custom-validation.pipe';
import { HttpExceptionFilter } from './common/app/exceptions/http-exception-filter';
import { ResponseInterceptor } from './common/app/interceptors/response.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useBodyParser('json', { limit: '10mb' });
  app.use(cookieParser());
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints)[0],
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errorValidations: formattedErrors,
        });
      },
    }),
  );
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor(logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

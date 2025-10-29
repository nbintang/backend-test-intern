import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '../../src/common/app/exceptions/http-exception-filter';
import { ResponseInterceptor } from '../../src/common/app/interceptors/response.interceptor';
import { AppModule } from '../../src/app.module';
import { AccessTokenGuard } from '../../src/modules/auth/guards/access-token.guard';

export async function initializeTestingApp(): Promise<INestApplication> {
  const MERCHANT_ID = 1;
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(AccessTokenGuard)
    .useValue({
      canActivate: (context) => {
        const req = context.switchToHttp().getRequest();
        req.user = { id: MERCHANT_ID };
        return true;
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor(logger));

  await app.init();
  return app;
}

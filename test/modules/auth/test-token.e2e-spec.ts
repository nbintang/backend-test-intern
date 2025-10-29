import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import cookieParser from 'cookie-parser';

describe('Auth Token E2E', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return accessToken when login success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'merchant@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');

    accessToken = res.body.accessToken;
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/protected/merchants/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email');
  });

  it('should fail to access protected route with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/protected/merchants/me')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.status).toBe(401);
  });
});

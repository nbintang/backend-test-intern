import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';

describe('AuthController (e2e) | Login', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initializeTestingApp();
  });
  afterAll(async () => {
    await app.close();
  });
  it('POST /api/auth/login | Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'merchant@example.com',
        password: 'password123',
      })
      .expect(200);
    expect(response.body).toEqual({
      statusCode: 200,  
      success: true,
      message: 'Success',
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });
  it('POST /api/auth/login | Invalid Password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'merchant@example.com',
        password: 'password12312',
      })
      .expect(401);
    expect(response.body).toEqual({
      cause: 'Unauthorized',
      message: 'Invalid password',
      statusCode: 401,
      success: false,
      timestamp: expect.any(String),
    });
  });
  it('POST /api/auth/login | Merchant Not Registered', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'notmerchant@example.com',
        password: 'password12312',
      })
      .expect(401);
    expect(response.body).toEqual({
      cause: 'Unauthorized',
      message: 'Merchant not registered',
      statusCode: 401,
      success: false,
      timestamp: expect.any(String),
    });
  });
});

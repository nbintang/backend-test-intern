import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize-test-app';

describe('AuthController (e2e) | Register', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });
  it('POST /api/auth/register', async () => {
    const USER_FULLNAME = `Bintang ${Date.now()}`;
    const USER_EMAIL = `bintang${Date.now()}@example.com`;
    const PAYLOAD = {
        fullName: USER_FULLNAME,
        email: USER_EMAIL,
        password: 'StrongPass123!',
        confirmationPassword: 'StrongPass123!',
        phoneNumber: '081234567890',
        address: 'Jl. Melati No. 123, Jakarta',
      }
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(PAYLOAD)
      .expect(201);
    expect(response.body).toEqual({
      statusCode: 201,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        email: USER_EMAIL,
        fullName: USER_FULLNAME,
        address: 'Jl. Melati No. 123, Jakarta',
        phoneNumber: '+6281234567890',
      },
    });
  });
});

import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec'; 

describe('AuthController (e2e) | Register', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });
  it('POST /api/auth/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        fullName: `Bintang ${Date.now()}`,
        email: `bintang${Date.now()}@example.com`,
        password: 'StrongPass123!',
        confirmationPassword: 'StrongPass123!',
        phoneNumber: '081234567890',
        address: 'Jl. Melati No. 123, Jakarta',
      })
      .expect(201);
    expect(response.body).toEqual({
      statusCode: 201,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        email: `bintang${Date.now()}@example.com`,
        fullName: `Bintang ${Date.now()}`,
        address: 'Jl. Melati No. 123, Jakarta',
        phoneNumber: '+6281234567890',
      },
    });
  });
});

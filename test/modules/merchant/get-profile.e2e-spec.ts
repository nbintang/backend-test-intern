import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize-test-app';
describe('MerchantController (e2e) | Get Profile', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/merchants/me | Should return merchant profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/protected/merchants/me')
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        email: expect.any(String),
        fullName: expect.any(String),
        phoneNumber: expect.any(String),
        address: expect.any(String),
      },
    })
  });
});

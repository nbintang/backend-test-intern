import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('MerchantController (e2e) | Update Profile', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 }, 20000);

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/merchants/me | Should update profile', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/protected/merchants/me')
      .send({ fullName: 'John Doe' })
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        email: expect.any(String),
        fullName: 'John Doe',
        phoneNumber: expect.any(String),
        address: expect.any(String),
      },
    })
  });
});

import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('OrderController (e2e) | Get By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/orders/:id | Should return order', async () => {
    const PARAM = 2;

    const response = await request(app.getHttpServer())
      .get(`/api/protected/orders/${PARAM}`)
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: expect.objectContaining({
        id: expect.any(Number),
        quantity: expect.any(Number),
        totalAmount: expect.any(Number),
        status: expect.any(String),
        customerName: expect.any(String),
        createdAt: expect.any(String),
        merchant: expect.objectContaining({
          id: expect.any(Number),
          fullName: expect.any(String),
          email: expect.any(String),
          address: expect.any(String),
        }),
        product: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        }),
      }),
    });
  });
  it('GET /api/protected/orders/:id | Should return Not Found', async () => {
    const PARAM = 99;

    return await request(app.getHttpServer())
      .get(`/api/protected/orders/${PARAM}`)
      .expect(404);
  });
});

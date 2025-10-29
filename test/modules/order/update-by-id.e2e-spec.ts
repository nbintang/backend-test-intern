import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('OrderController (e2e) | Update By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/orders/:id | Should update order', async () => {
    const PARAM = 2;
    const response = await request(app.getHttpServer())
      .patch(`/api/protected/orders/${PARAM}`)
      .send({ status: 'COMPLETED', productId: 1 })
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
  it('PATCH /api/protected/orders/:id | Should return Not Found', async () => {
    const PARAM = 99;
    return await request(app.getHttpServer())
      .patch(`/api/protected/orders/${PARAM}`)
      .send({ status: 'COMPLETED', productId: 6 })
      .expect(404);
  });
});

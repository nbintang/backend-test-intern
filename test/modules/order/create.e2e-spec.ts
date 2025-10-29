import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('OrderController (e2e) | Create', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/protected/orders | Should create an order and return OrderResponseDto', async () => {
    const payload = {
      productId: 1,
      quantity: 1,
      customerName: 'John Doe',
      status: 'PENDING',
    };

    const response = await request(app.getHttpServer())
      .post('/api/protected/orders')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      statusCode: 201,
      success: true,
      message: 'Success',
      data: expect.objectContaining({
        id: expect.any(Number),
        quantity: payload.quantity,
        totalAmount: expect.any(Number), 
        status: payload.status,
        customerName: payload.customerName,
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
  it('POST /api/protected/orders | Should return Not Found', async () => {
    const payload = {
      productId: 121,
      quantity: 1,
      customerName: 'John Doe',
      status: 'PENDING',
    };
    return await request(app.getHttpServer())
      .post('/api/protected/orders')
      .send(payload)
      .expect(404);
  });

});

import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('ProductController (e2e) | Update By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/products/:id | Should update product', async () => {
    const PARAM = 2;
    const PAYLOAD = {
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      categoryId: 2,
      stock: 10,
    };
    const response = await request(app.getHttpServer())
      .patch(`/api/protected/products/${PARAM}`)
      .send(PAYLOAD)
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        category: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
        stock: expect.any(Number),
        createdAt: expect.any(String),
      }),
    });
  });

  it('PATCH /api/protected/products/:id | Should return Not Found or category not found', async () => {
    const PARAM = 999;
    const PAYLOAD = {
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      categoryId: 99,
      stock: 10,
    };
    return await request(app.getHttpServer())
      .patch(`/api/protected/products/${PARAM}`)
      .send(PAYLOAD)
      .expect(404);
  });
});

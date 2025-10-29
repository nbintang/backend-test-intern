import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('ProductController (e2e) | Create', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/protected/products | Should create a new product', async () => {
    const PAYLOAD = {
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      categoryId: 1,
      stock: 10,
    };
    const response = await request(app.getHttpServer())
      .post('/api/protected/products')
      .send(PAYLOAD)
      .expect(201);

    expect(response.body).toEqual({
      statusCode: 201,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        name: PAYLOAD.name,
        description: PAYLOAD.description,
        price: PAYLOAD.price,
        category:  expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
        stock: PAYLOAD.stock,
        createdAt: expect.any(String),
      },
    });
  });
  it('POST /api/protected/products | Should return category not found', async () => {
    const PAYLOAD = {
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      categoryId: 99,
      stock: 10,
    };
   return await request(app.getHttpServer())
      .post('/api/protected/products')
      .send(PAYLOAD)
      .expect(404);
 
  });
});

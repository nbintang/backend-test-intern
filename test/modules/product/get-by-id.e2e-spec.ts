import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('ProductController (e2e) | Get By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/products/:id | Should return product', async () => {
    const PARAM = 2;
    const response = await request(app.getHttpServer()).get(
      `/api/protected/products/${PARAM}`,
    );

    if (response.status === 200) {
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: 'Success',
        data: {
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          stock: expect.any(Number),
          category: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
          createdAt: expect.any(String),
        },
      });
    } else if (response.status === 404) {
      expect(response.body).toEqual({
        statusCode: 404,
        cause: 'Not Found',
        success: false,
        message: 'Product not found',
        timestamp: expect.any(String),
      });
    }
  });
});

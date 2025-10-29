import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('CategoriesController (e2e) | Get By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });
  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/categories/:id | Should return category or handle error', async () => {
    const PARAMS = 2;

    const response = await request(app.getHttpServer())
      .get(`/api/protected/categories/${PARAMS}`);

    if (response.status === 200) {
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: 'Success',
        data: {
          id: expect.any(Number),
          name: expect.any(String),
        },
      });
    } else if (response.status === 404) {
      expect(response.body).toEqual({
        statusCode: 404,
        cause: 'Not Found',
        success: false,
        message: 'Category not found',
        timestamp: expect.any(String),
      });
    } else if (response.status === 500) {
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
        }),
      );
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  });
});

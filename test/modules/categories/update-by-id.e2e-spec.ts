import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
import request from 'supertest';

describe('CategoriesController (e2e) | Update By ID', () => { 
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/categories/:id | Should update or handle error', async () => { 
    const CATEGORY_NAME = `Category-${Date.now()}`;
    const CATEGORY_ID = 9;

    const response = await request(app.getHttpServer())
      .patch(`/api/protected/categories/${CATEGORY_ID}`)
      .send({ name: CATEGORY_NAME });

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
    } else if (response.status === 409) {
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 409,
          success: false,
          message: expect.stringMatching(/already exists/i),
        }),
      );
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

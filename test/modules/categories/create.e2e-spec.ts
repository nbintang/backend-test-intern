import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
import request from 'supertest';

describe('CategoriesController (e2e) | Create', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/protected/categories | Should create a new category', async () => {
    const CATEGORY_NAME = `Category-${Date.now()}`;

    const response = await request(app.getHttpServer())
      .post('/api/protected/categories')
      .send({ name: CATEGORY_NAME })
      .expect(201);

    expect(response.body).toEqual({
      statusCode: 201,
      success: true,
      message: 'Success',
      data: {
        id: expect.any(Number),
        name: CATEGORY_NAME,
      },
    });
  });

  it('POST /api/protected/categories | Should return conflict when duplicate', async () => {

    const DUPLICATE_NAME = `Category-Duplicate`;

    await request(app.getHttpServer())
      .post('/api/protected/categories')
      .send({ name: DUPLICATE_NAME })
      .expect(201);
 
    const response = await request(app.getHttpServer())
      .post('/api/protected/categories')
      .send({ name: DUPLICATE_NAME })
      .expect(409);

    expect(response.body).toEqual(
      expect.objectContaining({
        cause: 'Conflict',
        message: expect.stringMatching(/already exists/i),
        statusCode: 409,
        success: false,
        timestamp: expect.any(String),
      }),
    );
  });
});

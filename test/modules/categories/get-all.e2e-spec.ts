import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('CategoriesController (e2e) | Get All', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/categories | Should return all categories', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/protected/categories')
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Categories retrieved successfully',
      data: expect.any(Array),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    });
  });

  it('GET /api/protected/categories | Should return all categories with Pagination', async () => {
    const LIMIT = 2;
    const PAGE = 1;
    const SEARCH = 'Kopi';

    const response = await request(app.getHttpServer())
      .get(
        `/api/protected/categories?limit=${LIMIT}&page=${PAGE}&search=${SEARCH}`,
      )
      .expect(200);
    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Categories retrieved successfully',
      data: expect.any(Array),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    });
  });
});

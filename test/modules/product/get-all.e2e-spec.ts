import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('ProductController (e2e) | Get All', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/products | Should return all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/protected/products')
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
      data: expect.any(Array),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    });
  });
  it('GET /api/protected/products | Should return all products with Pagination', async () => {
    const LIMIT = 2;
    const PAGE = 1;
    const SEARCH = 'Latte';
    const CATEGORY = 'Kopi'; 
    const response = await request(app.getHttpServer())
      .get(`/api/protected/products?limit=${LIMIT}&page=${PAGE}&search=${SEARCH}&category=${CATEGORY}`)
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
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

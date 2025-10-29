import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('OrderController (e2e) | Get All', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/orders | Should return all orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/protected/orders')
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      data: expect.any(Array),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    })
  });
  it('GET /api/protected/orders | Should return all orders with Pagination', async () => {
    const LIMIT = 2;
    const PAGE = 1;
    const SEARCH = 'John';
    const STATUS = 'PENDING';
    const category = 'Kopi';
    const response = await request(app.getHttpServer())
      .get(`/api/protected/orders?limit=${LIMIT}&page=${PAGE}&search=${SEARCH}&status=${STATUS}&category=${category}`)
      .expect(200);

    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      data: expect.any(Array),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    })
  });
});

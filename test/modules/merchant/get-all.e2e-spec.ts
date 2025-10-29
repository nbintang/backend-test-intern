import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('MerchantController (e2e) | Get All', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/merchants | Should return all merchants', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/protected/merchants')
      .expect(200);
    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Merchants retrieved successfully',
      data: expect.any(Array<Object>),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    });
  });
  it('GET /api/protected/merchants | Should return all merchants with pagination', async () => {
    const LIMIT = 2;
    const PAGE = 1;
    const SEARCH = 'mercha';
    const response = await request(app.getHttpServer())
      .get(
        `/api/protected/merchants?limit=${LIMIT}&page=${PAGE}&search=${SEARCH}`,
      )
      .expect(200);
    expect(response.body).toEqual({
      statusCode: 200,
      success: true,
      message: 'Merchants retrieved successfully',
      data: expect.any(Array<Object>),
      meta: {
        totalItems: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
        itemsPerPage: expect.any(Number),
      },
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';

describe('ProductController (e2e) | Delete By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE /api/protected/products/:id', async () => {
    const PARAM = 3;
    return await request(app.getHttpServer())
      .delete(`/api/protected/products/${PARAM}`)
      .expect(200);
  });
});

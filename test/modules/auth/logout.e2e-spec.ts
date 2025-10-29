import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initializeTestingApp } from '../../shared/initialize-test-app';

describe('AuthController (e2e) | Logout', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await initializeTestingApp();
  });
  afterAll(async () => {
    await app.close();
  });
  it('DELETE /api/auth/logout | Success', async () => {
    return await request(app.getHttpServer())
      .delete('/api/auth/logout')
      .expect(200);
  });
});

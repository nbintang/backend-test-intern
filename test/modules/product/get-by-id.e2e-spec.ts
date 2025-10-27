import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('ProductController (e2e) | Get By ID', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/products/:id', async () => {
    // TODO
  });
});

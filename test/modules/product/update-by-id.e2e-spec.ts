import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('ProductController (e2e) | Update By ID', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/products/:id', async () => {
    // TODO
  });
});

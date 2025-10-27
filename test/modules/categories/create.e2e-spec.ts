import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('CategoriesController (e2e) | Create', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await initializeTestingApp();
  });
  afterAll(async () => {
    await app.close();
  });
  it('POST /api/protected/categories', async () => {
    // TODO
  });
});

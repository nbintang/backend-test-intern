import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('CategoriesController (e2e) | Delete By ID', () => { 
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE /api/protected/categories/:id', async () => { 
    // TODO
  });
});

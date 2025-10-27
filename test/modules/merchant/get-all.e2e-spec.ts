import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('MerchantController (e2e) | Get All', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/protected/merchants', async () => {
    // TODO
  });
});

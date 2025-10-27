import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
describe('MerchantController (e2e) | Update Profile', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/protected/merchants/me', async () => {
    // TODO
  });
});

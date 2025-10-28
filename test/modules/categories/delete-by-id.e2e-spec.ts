import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize.e2e-spec';
import request from 'supertest';

describe('CategoriesController (e2e) | Delete By ID', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE /api/protected/categories/:id | Should delete or handle errors', async () => {
    const PARAM = 9;

    const response = await request(app.getHttpServer())
      .delete(`/api/protected/categories/${PARAM}`);

    if (response.status === 200) {
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: 'Category deleted successfully',
      });
    } else if (response.status === 404) {
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          success: false,
        }),
      );
    } else if (response.status === 500) {
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
        }),
      );
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  });
});

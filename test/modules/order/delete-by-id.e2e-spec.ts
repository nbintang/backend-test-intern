import { INestApplication } from '@nestjs/common';
import { initializeTestingApp } from '../../shared/initialize-test-app';
import request from 'supertest';
describe('OrderController (e2e) | Delete By ID', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestingApp();
 });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE /api/protected/orders/:id | Should delete or handle errors', async () => {
    const  PARAM = 3;

    const response = await request(app.getHttpServer())
      .delete(`/api/protected/orders/${PARAM}`);

    if (response.status === 200) {
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: 'Order deleted successfully',
      });
    } else if (response.status === 404) {
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          cause: 'Not Found',
          success: false,
          message: 'Order not found',
          timestamp: expect.any(String),
        }),
      );
    }
  });
});

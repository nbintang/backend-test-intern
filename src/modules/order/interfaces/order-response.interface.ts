import { Prisma } from '@prisma/client';

export interface OrderResponse
  extends Prisma.OrderGetPayload<{
    include: { product: { include: { category: true } }; merchant: true };
  }> {}

import { Prisma } from '@prisma/client';

export interface ProductResponse
  extends Prisma.ProductGetPayload<{ include: { category: true } }> {}

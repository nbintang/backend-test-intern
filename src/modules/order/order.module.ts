import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

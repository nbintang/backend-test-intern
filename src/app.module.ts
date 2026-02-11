import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MerchantModule } from './modules/merchant/merchant.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './config/app/config.module';
import { AuthConfigModule } from './config/auth/config.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    AppConfigModule,
    AuthConfigModule,
    MerchantModule,
    PrismaModule,
    RedisModule,
    ProductModule,
    AuthModule,
    OrderModule,
    LoggerModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

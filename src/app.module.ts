import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './config/app/app.config.module';
import { AuthConfigModule } from './config/auth/auth.config.module';
import { CategoriesModule } from './modules/categories/categories.module';


@Module({
  imports: [
    AppConfigModule,
    AuthConfigModule,
    UserModule,
    PrismaModule,
    ProductModule,
    AuthModule,
    OrderModule,
    LoggerModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

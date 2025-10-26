import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module'; 
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [UserModule, PrismaModule, ProductModule, AuthModule, OrderModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { QueryProductDto } from '../dto/requests/query-product.dto';
import { Prisma, Product } from '@prisma/client';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';
import { ProductResponse } from '../interfaces/product-response.interface';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createProduct(
    merchantId: number,
    dto: CreateProductDto,
  ): Promise<ProductResponse> {
    await this.categoriesService.findCategoryById(dto.categoryId);
    const product = await this.prisma.product.create({
      data: {
        merchantId,
        ...dto,
      },
      include: {
        category: true,
      },
    });
    return product;
  }

  async findProducts(
    query: QueryProductDto,
  ): Promise<ServerPaginatedResponseDto<ProductResponse>> {
    const { page = 1, limit = 10, search, category } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && {
        category: { name: { equals: category, mode: 'insensitive' } },
      }),
    };
    const products = await this.prisma.product.findMany({
      where,
      skip,
      include: {
        category: true,
      },
      take: limit,
    });
    const total = await this.prisma.product.count({ where });
    return {
      data: products,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findProductById(id: number): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProductById(
    id: number,
    dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    const existingProduct = await this.findProductById(id);
    if (dto.categoryId) {
      await this.categoriesService.findCategoryById(dto.categoryId);
    }
    const product = await this.prisma.product.update({
      where: { id: existingProduct.id },
      data: dto,
      include: {
        category: true,
      },
    });
    return product;
  }

  async deleteProductById(id: number) {
    const product = await this.findProductById(id);
    await this.prisma.product.delete({
      where: { id: product.id },
    });
    return {
      message: 'Product deleted successfully',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma, Product } from '@prisma/client';
import { ServerPaginatedResponseDto } from '../../common/app/dto/server-response.dto';
 
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(
    dto: CreateProductDto,
  ): Promise<Prisma.ProductGetPayload<{ include: { category: true } }>> {
    const product = await this.prisma.product.create({
      data: dto,
      include: {
        category: true,
      },
    });
    return product;
  }

  async findProducts(
    query: QueryProductDto,
  ): Promise<
    ServerPaginatedResponseDto<
      Prisma.ProductGetPayload<{ include: { category: true } }>
    >
  > {
    const { page = 1, limit = 10, search, category } = query;
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = {
        name: category,
      };
    }
    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
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

  async findProductById(
    id: number,
  ): Promise<Prisma.ProductGetPayload<{ include: { category: true } }>> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return product;
  }

  async updateProductById(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
    return product;
  }

  async deleteProductById(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });
    return {
      message: 'Product deleted successfully',
    }
  }
}

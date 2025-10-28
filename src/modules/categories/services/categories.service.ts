import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/requests/create-category.dto';
import { UpdateCategoryDto } from '../dto/requests/update-category.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { QueryCategoryDto } from '../dto/requests/query-category.dto';
import { Category, Prisma } from '@prisma/client';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.findExistingCategory(dto.name);
    if (existingCategory)
      throw new ConflictException(`Category ${dto.name} already exists`);
    const category = await this.prisma.category.create({
      data: dto,
    });
    return category;
  }

  async findExistingCategory(name: string): Promise<Category> {
    return await this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findCategories(
    query: QueryCategoryDto,
  ): Promise<ServerPaginatedResponseDto<Category>> {
    const { page = 1, limit = 10, search } = query;
    const where: Prisma.CategoryWhereInput = {
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
    };
    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.category.count({ where });
    return {
      data: categories,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategoryById(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.findExistingCategory(dto.name);
    if (existingCategory)
      throw new ConflictException(`Category ${dto.name} already exists`);
    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });
    return category;
  }

  async deleteCategoryById(id: number): Promise<{ message: string }> {
    const category = await this.findCategoryById(id);
    await this.prisma.category.delete({
      where: { id: category.id  },
    });
    return {
      message: 'Category deleted successfully',
    };
  }
}

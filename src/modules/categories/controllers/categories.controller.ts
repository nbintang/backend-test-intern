import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/requests/create-category.dto';
import { UpdateCategoryDto } from '../dto/requests/update-category.dto';
import { QueryCategoryDto } from '../dto/requests/query-category.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDto } from '../dto/responses/category-response.dto';
import {
  ServerPaginatedResponseDto,
  ServerResponseDto,
} from '../../../common/app/dto/server-response.dto';

@Controller('protected/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategories(
    @Query() query: QueryCategoryDto,
  ): Promise<ServerPaginatedResponseDto<CategoryResponseDto>> {
    const { data: categories, meta } =
      await this.categoriesService.findCategories(query);
    const transformedData = plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Categories retrieved successfully',
      data: transformedData,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findCategoryById(+id);
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.updateCategoryById(
      +id,
      updateCategoryDto,
    );
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCategoryById(
    @Param('id') id: string,
  ): Promise<ServerResponseDto> {
    return await this.categoriesService.deleteCategoryById(+id);
  }
}

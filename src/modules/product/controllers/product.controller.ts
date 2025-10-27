import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { QueryProductDto } from '../dto/requests/query-product.dto';
import { ProductResponseDto } from '../dto/responses/product-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ServerPaginatedResponseDto,
  ServerResponseDto,
} from '../../../common/app/dto/server-response.dto';
import { Request } from 'express';
@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
  ): Promise<ProductResponseDto> {
    const merchantId = request.user.id;
    const product = await this.productService.createProduct(
      merchantId,
      createProductDto,
    );
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query() query: QueryProductDto,
  ): Promise<ServerPaginatedResponseDto<ProductResponseDto>> {
    const { data: products, meta } =
      await this.productService.findProducts(query);
    const transformedData = plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Products retrieved successfully',
      data: transformedData,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productService.findProductById(+id);
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productService.updateProductById(
      +id,
      updateProductDto,
    );
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id') id: string): Promise<ServerResponseDto> {
    return await this.productService.deleteProductById(+id);
  }
}

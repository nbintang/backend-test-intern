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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { QueryProductDto } from './dto/query-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { plainToInstance } from 'class-transformer';
import { ServerPaginatedResponseDto, ServerResponseDto } from '../../common/app/dto/server-response.dto';
@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    const product = await this.productService.createProduct(createProductDto);
    const transformedData = plainToInstance(ResponseProductDto, product, {
      excludeExtraneousValues: true,
    });
    return transformedData;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query() query: QueryProductDto,
  ): Promise<ServerPaginatedResponseDto<ResponseProductDto>> {
    const { data: products, meta } =
      await this.productService.findProducts(query);
    const transformedData = plainToInstance(ResponseProductDto, products, {
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
  async getProductById(@Param('id') id: string): Promise<ResponseProductDto> {
    const product = await this.productService.findProductById(+id);
    const transformedData = plainToInstance(ResponseProductDto, product, {
      excludeExtraneousValues: true,
    });
    return transformedData;
  }

  @Patch(':id')
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponseProductDto> {
    const product = await this.productService.updateProductById(+id, updateProductDto);
    const transformedData = plainToInstance(ResponseProductDto, product, {
      excludeExtraneousValues: true,
    });
    return transformedData;
  }

  @Delete(':id')
  async deleteProductById(@Param('id') id: string): Promise<ServerResponseDto> {
    return await this.productService.deleteProductById(+id);
  }
}

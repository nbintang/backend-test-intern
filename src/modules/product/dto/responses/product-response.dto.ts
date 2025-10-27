import { Product } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from '../../../categories/dto/responses/category-response.dto';
 
@Exclude()
export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @Expose()
  createdAt?: Date;
}

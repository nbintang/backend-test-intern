import { Product } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseCategoryDto } from '../../categories/dto/response-category.dto';
 
@Exclude()
export class ResponseProductDto implements Partial<Product> {
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
  @Type(() => ResponseCategoryDto)
  category?: ResponseCategoryDto;

  @Expose()
  createdAt?: Date;
}

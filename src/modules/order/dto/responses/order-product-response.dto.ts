import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from '../../../categories/dto/responses/category-response.dto';

@Exclude()
export class OrderProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;
}

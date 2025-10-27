import {
  IsInt,
  IsString,
  Min,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsString()
  @MinLength(3, { message: 'Customer name must be at least 3 characters' })
  @MaxLength(50, { message: 'Customer name must be at most 50 characters' })
  @Transform(({ value }: { value: string }) => value.trim())
  customerName: string;

  @IsEnum(OrderStatus, {
    message: `Status must be one of ${Object.values(OrderStatus).join(', ')}`,
  })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  status: OrderStatus;
}

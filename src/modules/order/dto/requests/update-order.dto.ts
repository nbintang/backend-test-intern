import {
  IsInt,
  IsString,
  Min,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';
import { Transform } from 'class-transformer';

export class UpdateOrderDto {
  @IsInt()
  @IsOptional()
  productId?: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Customer name must be at least 3 characters' })
  @MaxLength(50, { message: 'Customer name must be at most 50 characters' })
  @Transform(({ value }: { value: string }) => value.trim())
  customerName?: string;

  @IsEnum(OrderStatus, {
    message: `Status must be one of ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  status?: OrderStatus;
}

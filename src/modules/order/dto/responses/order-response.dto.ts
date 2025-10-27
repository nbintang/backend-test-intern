import { Exclude, Expose, Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { OrderProductResponseDto } from './order-product-response.dto';
import { OrderMerchantDto } from './order-merchant-response.dto';

@Exclude()
export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  totalAmount: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  customerName?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => OrderMerchantDto)
  merchant: OrderMerchantDto;

  @Expose()
  @Type(() => OrderProductResponseDto)
  product: OrderProductResponseDto;
}

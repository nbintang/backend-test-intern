import { Exclude, Expose } from "class-transformer";

@Exclude()
export class OrderMerchantDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  email: string;
  
  @Expose()
  address: string;
}
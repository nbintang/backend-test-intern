import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  address: string;

  @Expose()
  phoneNumber: string;
}

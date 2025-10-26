import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseCategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(50, { message: 'Name must be at most 50 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @MaxLength(1000, { message: 'Description must be at most 1000 characters' })
  description?: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @IsNotEmpty({ message: 'Stock is required' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsNumber({}, { message: 'Category Id must be a number' })
  @IsNotEmpty({ message: 'Category Id is required' })
  categoryId: number;
}

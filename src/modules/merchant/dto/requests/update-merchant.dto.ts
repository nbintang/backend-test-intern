import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateMerchantDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Full name must be at most 50 characters long' })
  @Transform(({ value }) => value.trim())
  fullName?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('ID', {
    message: 'Invalid phone number, must be in format +62',
  })
  @Transform(({ value }) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('0')) return '+62' + trimmed.slice(1);
    return trimmed;
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @Matches(/Jl/i, { message: 'Address must contain "Jl"' })
  @Transform(({ value }) => value?.trim())
  address?: string;
}

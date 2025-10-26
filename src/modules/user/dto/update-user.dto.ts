import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
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
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @Matches(/Jl/i, { message: 'Address must contain "Jl"' })
  @Transform(({ value }) => value?.trim())
  address?: string;
}

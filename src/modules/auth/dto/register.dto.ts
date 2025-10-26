import { Transform } from 'class-transformer';
import { Match } from '../../../common/app/validators/match.validator';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator'; 

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters, include uppercase, lowercase, numbers, and symbols',
    },
  )
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;

  @Match('password')
  confirmationPassword: string;

  @IsString()
  @IsNotEmpty()
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

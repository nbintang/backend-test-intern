import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto'; 
import  argon from 'argon2';
import { MerchantPayload } from '../interfaces/user-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt'; 
import { LoginDto } from '../dto/login.dto'; 
import { AuthConfigService } from '../../../config/auth/auth.config.service';
import { MerchantService } from '../../merchant/services/merchant.service';
import { Merchant } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly jwtService: JwtService,
    private readonly authConfigService: AuthConfigService,
  ) {}
  private async generateJwtTokens(payload: MerchantPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: this.authConfigService.accessSecret,
          expiresIn: '30s',
        },
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: this.authConfigService.refreshSecret,
          expiresIn: '1d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async register(dto: RegisterDto): Promise<Merchant> {
    const existedMerchant = await this.merchantService.findExistingMerchantByEmail(
      dto.email,
    );
    if (existedMerchant) throw new ConflictException('Merchant already exists');
    const { password, confirmationPassword, ...rest } = dto;
    const merchant = await this.merchantService.createMerchant({
      ...rest,
      password: await argon.hash(password),
    });
    return merchant;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const merchant = await this.merchantService.findExistingMerchantByEmail(dto.email);
    if (!merchant) throw new UnauthorizedException('Merchant not registered');
    const isValidPassword = await argon.verify(merchant.password, dto.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
    const { accessToken, refreshToken } = await this.generateJwtTokens({
      id: merchant.id,
      email: merchant.email,
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(
    merchantId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const merchant = await this.merchantService.findMerchantById(merchantId);
    if (!merchant) throw new ForbiddenException('Access Denied');
    return await this.generateJwtTokens({ id: merchant.id, email: merchant.email });
  }
}

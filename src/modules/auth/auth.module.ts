import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy'; 
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { MerchantModule } from '../merchant/merchant.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigModule } from '../../config/auth/auth.config.module';

@Module({
  imports: [AuthConfigModule, MerchantModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
})
export class AuthModule {}

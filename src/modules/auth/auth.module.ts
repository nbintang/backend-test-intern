import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy'; 
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigModule } from '../../config/auth/auth.config.module';

@Module({
  imports: [AuthConfigModule, UserModule, JwtModule.register({})],
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

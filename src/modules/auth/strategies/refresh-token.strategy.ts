import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'; 
import { MerchantJwtPayload } from '../interfaces/user-jwt-payload.interface';
import { AuthConfigService } from '../../../config/auth/auth.config.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  JwtStrategy,
  'jwt-refresh',
) {
  constructor(authConfigService: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['refreshToken'];
          }
          return token;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: authConfigService.accessSecret,
    });
  }
  async validate(request: Request, payload: MerchantJwtPayload) {
    const refreshToken = request.cookies['refreshToken'];
    return { ...payload, refreshToken };
  }
}

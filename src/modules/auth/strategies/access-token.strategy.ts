import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { UserJwtPayload } from '../interfaces/user-jwt-payload.interface'; ;
import { AuthConfigService } from '../../../config/auth/auth.config.service';
 
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(JWTStrategy, 'jwt') {
  constructor(authConfigService: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfigService.accessSecret,
    });
  }
  validate(payload: UserJwtPayload) {
    return payload;
  }
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}
  get accessSecret(): string {
    return this.configService.get<string>('auth.jwtAccessSecret');
  }

  get refreshSecret(): string {
    return this.configService.get<string>('auth.jwtRefreshSecret');
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}
  get port(): number {
    return this.configService.get<number>('app.port');
  }
  get frontendUrl(): string {
    return this.configService.get<string>('app.frontendUrl');
  }
  get backendUrl(): string {
    return this.configService.get<string>('app.backendUrl');
  }
}

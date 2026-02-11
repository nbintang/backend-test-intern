import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config';
import { authConfigSchema } from './config.schema';
import { AuthConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
      validationSchema: authConfigSchema,
      validate: (config) => authConfigSchema.parse(config),
      expandVariables: true,
    }),
  ],
  providers: [AuthConfigService],
  exports: [AuthConfigService],
})
export class AuthConfigModule {}

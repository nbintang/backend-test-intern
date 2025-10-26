import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import { authConfigSchema } from './auth.config.schema';
import { AuthConfigService } from './auth.config.service';

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

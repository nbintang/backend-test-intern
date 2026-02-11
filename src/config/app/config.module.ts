import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config';
import { appConfigSchema } from './config.schema';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigSchema,
      validate: (config) => appConfigSchema.parse(config),
      expandVariables: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}

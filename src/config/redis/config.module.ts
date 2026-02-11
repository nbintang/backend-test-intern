import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './config';
import { redisConfigSchema } from './config.schema';
import { RedisConfigService } from './config.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
      validationSchema: redisConfigSchema,
      validate: (config) => redisConfigSchema.parse(config),
      expandVariables: true,
    }),
  ],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}

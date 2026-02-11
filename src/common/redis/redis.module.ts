import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { RedisService } from './redis.service';
import { RedisConfigService } from '../../config/redis/config.service';
import { RedisConfigModule } from '../../config/redis/config.module';
import { redisStore } from 'cache-manager-redis-store';
@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        store: await redisStore({
          socket: {
            host: redisConfigService.host,
            port: redisConfigService.port,
          },
          password: redisConfigService.password || undefined,
          db: 0,
        }),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

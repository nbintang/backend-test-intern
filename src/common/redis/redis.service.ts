import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisKeyBuilder } from './redis-key.builder';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  useKey(initialSegment: string | number): RedisKeyBuilder {
    return new RedisKeyBuilder(initialSegment);
  }

  get<T>(key: string | RedisKeyBuilder) {
    console.log('Keys:', key.toString());
    return this.cache.get<T>(key.toString());
  }

  set<T>(key: string | RedisKeyBuilder, value: T, ttl?: number) {
    return this.cache.set(key.toString(), value, ttl);
  }

  delete(key: string | RedisKeyBuilder) {
    return this.cache.del(key.toString());
  }
}

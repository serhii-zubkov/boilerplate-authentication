import { Injectable, Inject } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigurationService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CacheService {
  constructor(
    private config: ConfigurationService,
    private logger: LoggerService,
    @Inject('RedisConnection') private redis: ReturnType<typeof createClient>,
  ) {}

  static enabled: boolean = false;
  static async boot(logger: LoggerService, config: ConfigurationService) {
    if (config.get<any>('redis').enabled) {
      const redis = createClient(config.get<any>('redis').url);
      redis.on('connect', async () => {
        logger.log('Redis is connected', 'CacheService');
      });
      redis.on('ready', async () => {
        CacheService.enabled = true;
        logger.log('Redis is ready', 'CacheService');
      });
      redis.on('reconnecting', async () => {
        logger.warn('Redis is reconnecting', 'CacheService');
      });
      redis.on('end', async () => {
        logger.log('Redis is ended', 'CacheService');
      });
      redis.on('error', async (err) => {
        CacheService.enabled = false;
        logger.error(`Redis: ${err}`, 'CacheService');
      });
      redis.connect();
      return redis;
    }
  }

  public async set(
    key: string | Buffer,
    value: string | Buffer,
  ): Promise<string | null> {
    if (!CacheService.enabled) {
      return null;
    }

    return this.redis.set(key, value);
  }

  public async setJson(
    key: string | Buffer,
    value: any,
  ): Promise<string | null> {
    return this.set(key, JSON.stringify(value));
  }

  public async get(key: string | Buffer): Promise<string | Buffer | null> {
    if (!CacheService.enabled) {
      return null;
    }

    return this.redis.get(key);
  }

  public async getJson(key: string | Buffer): Promise<any | null> {
    const value = await this.get(key);
    if (value && typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  }
}

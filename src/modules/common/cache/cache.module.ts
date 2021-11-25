import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { LoggerService } from '../logger/logger.service';
import { ConfigurationService } from '../config/config.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    CacheService,
    {
      provide: 'RedisConnection',
      inject: [LoggerService, ConfigurationService],
      useFactory: async (logger: LoggerService, config: ConfigurationService) =>
        CacheService.boot(logger, config),
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}

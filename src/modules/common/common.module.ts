import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from 'modules/common/cache/cache.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [AuthModule, CacheModule, ConfigModule, LoggerModule],
  controllers: [],
  providers: [],
  exports: [AuthModule, CacheModule, ConfigModule, LoggerModule],
})
export class CommonModule {}

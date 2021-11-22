import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [AuthModule, ConfigModule, LoggerModule],
  controllers: [],
  providers: [],
  exports: [AuthModule, ConfigModule, LoggerModule],
})
export class CommonModule {}

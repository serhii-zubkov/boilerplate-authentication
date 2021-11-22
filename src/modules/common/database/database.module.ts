import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'modules/common/config/config.module';
import { ConfigurationService } from 'modules/common/config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigurationService) => config.get<any>('database'),
      inject: [ConfigurationService],
    }),
  ],
})
export class DatabaseModule {}

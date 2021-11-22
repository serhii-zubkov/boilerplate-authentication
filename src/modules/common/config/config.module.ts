import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from 'modules/common/config/config.service';

@Global()
@Module({
  imports: [],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'modules/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LogicModule {}

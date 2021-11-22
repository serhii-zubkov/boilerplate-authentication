import { Module } from '@nestjs/common';
import { CommonModule } from 'modules/common/common.module';
import { CrudModule } from 'modules/crud/crud.module';
import { LogicModule } from 'modules/logic/logic.module';

@Module({
  imports: [CommonModule, CrudModule, LogicModule],
})
export class AppModule {}

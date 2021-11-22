import { Module } from '@nestjs/common';
import { DatabaseModule } from 'modules/common/database/database.module';
import { UsersModule } from 'modules/crud/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [],
  providers: [],
  exports: [UsersModule],
})
export class CrudModule {}

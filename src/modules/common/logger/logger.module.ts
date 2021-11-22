import { Module, DynamicModule, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  public static register(name: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'name',
          useValue: name,
        },
      ],
    };
  }
}

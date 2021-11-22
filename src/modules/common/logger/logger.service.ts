import { Injectable, Inject, ConsoleLogger } from '@nestjs/common';
import { ConfigurationService } from 'modules/common/config/config.service';

/**
 * This logger acts instead of basic @nestjs/common logger.
 * Thus, it has the same methods (log, verbose, debug, warn, error)
 * that can be changed at any time.
 */
@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(@Inject('name') private name: string) {
    super(name);
  }

  public async log(message: any, context?: string) {
    const payload = typeof message === 'object' ? message : { message };
    super.log(
      JSON.stringify({
        level: 'log',
        context,
        ...payload,
      }),
    );
  }

  public async verbose(message: any, context?: string) {
    const payload = typeof message === 'object' ? message : { message };
    super.verbose(
      JSON.stringify({
        level: 'verbose',
        context,
        ...payload,
      }),
    );
  }

  public async debug(message: any, context?: string) {
    const payload = typeof message === 'object' ? message : { message };
    super.debug(
      JSON.stringify({
        level: 'debug',
        context,
        ...payload,
      }),
    );
  }

  public async warn(message: any, context?: string) {
    const payload = typeof message === 'object' ? message : { message };
    super.warn(
      JSON.stringify({
        level: 'warn',
        context,
        ...payload,
      }),
    );
  }

  public async error(message: any, context?: string) {
    const payload = typeof message === 'object' ? message : { message };
    super.error(
      JSON.stringify({
        level: 'error',
        context,
        ...payload,
      }),
    );
  }
}

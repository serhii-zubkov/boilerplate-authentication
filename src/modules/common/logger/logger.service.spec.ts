import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { LoggerService } from './logger.service';

const spyMethod = jest.fn();

describe('Check logger.service.ts', () => {
  let service: LoggerService;
  const context = 'some-context';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);

    spyMethod.mockClear();
  });

  it('check log() method', () => {
    const message = 'some log() message';
    jest.spyOn(ConsoleLogger.prototype, 'log').mockImplementation(spyMethod);

    service.log(message, context);
    expect(JSON.parse(spyMethod.mock.calls[0][0])).toStrictEqual({
      level: 'log',
      context,
      message,
    });

    service.log({ message, additional: 'test' }, context);
    expect(JSON.parse(spyMethod.mock.calls[1][0])).toStrictEqual({
      level: 'log',
      context,
      message,
      additional: 'test',
    });
  });

  it('check verbose() method', () => {
    const message = 'some verbose() message';
    jest
      .spyOn(ConsoleLogger.prototype, 'verbose')
      .mockImplementation(spyMethod);

    service.verbose(message, context);
    expect(JSON.parse(spyMethod.mock.calls[0][0])).toStrictEqual({
      level: 'verbose',
      context,
      message,
    });

    service.verbose({ message, additional: 'test' }, context);
    expect(JSON.parse(spyMethod.mock.calls[1][0])).toStrictEqual({
      level: 'verbose',
      context,
      message,
      additional: 'test',
    });
  });

  it('check debug() method', () => {
    const message = 'some debug() message';
    jest.spyOn(ConsoleLogger.prototype, 'debug').mockImplementation(spyMethod);

    service.debug(message, context);
    expect(JSON.parse(spyMethod.mock.calls[0][0])).toStrictEqual({
      level: 'debug',
      context,
      message,
    });

    service.debug({ message, additional: 'test' }, context);
    expect(JSON.parse(spyMethod.mock.calls[1][0])).toStrictEqual({
      level: 'debug',
      context,
      message,
      additional: 'test',
    });
  });

  it('check warn() method', () => {
    const message = 'some warn() message';
    jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation(spyMethod);

    service.warn(message, context);
    expect(JSON.parse(spyMethod.mock.calls[0][0])).toStrictEqual({
      level: 'warn',
      context,
      message,
    });

    service.warn({ message, additional: 'test' }, context);
    expect(JSON.parse(spyMethod.mock.calls[1][0])).toStrictEqual({
      level: 'warn',
      context,
      message,
      additional: 'test',
    });
  });

  it('check error() method', () => {
    const message = 'some error() message';
    jest.spyOn(ConsoleLogger.prototype, 'error').mockImplementation(spyMethod);

    service.error(message, context);
    expect(JSON.parse(spyMethod.mock.calls[0][0])).toStrictEqual({
      level: 'error',
      context,
      message,
    });

    service.error({ message, additional: 'test' }, context);
    expect(JSON.parse(spyMethod.mock.calls[1][0])).toStrictEqual({
      level: 'error',
      context,
      message,
      additional: 'test',
    });
  });
});

describe('Check logger.module.ts', () => {
  let service: LoggerService;
  const context = 'some-context';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);

    spyMethod.mockClear();
  });

  it('check LoggerModule.register() should be defined', () => {
    expect(LoggerModule.register(context)).toBeDefined();
  });
});

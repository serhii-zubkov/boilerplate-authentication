import { Test, TestingModule } from '@nestjs/testing';
import { fakeAccount } from 'tests';

jest.mock('./auth.service');

import { UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'modules/crud/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

describe('Check local.strategy.ts', () => {
  let authService: AuthService;
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PassportModule, JwtModule.register({})],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('strategy validate(): should call service validateAccount()', async () => {
    authService.validateAccount = jest.fn().mockResolvedValue(fakeAccount);
    const result = await localStrategy.validate(
      'some@email.com',
      'some-password',
    );
    expect(authService.validateAccount).toBeCalledWith({
      email: 'some@email.com',
      password: 'some-password',
    });
    expect(result).toStrictEqual(fakeAccount);
  });

  it('strategy validate(): unauthorized exception', async () => {
    authService.validateAccount = jest.fn().mockResolvedValue(false);
    try {
      await localStrategy.validate('some@email.com', 'some-password');
    } catch (e) {
      expect(e).toStrictEqual(new UnauthorizedException());
    }
  });
});

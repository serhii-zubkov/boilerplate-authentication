import { Test, TestingModule } from '@nestjs/testing';
import { fakeAccount } from 'tests';

jest.mock('./auth.service');

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'modules/crud/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

describe('Check jwt.strategy.ts', () => {
  let authService: AuthService;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PassportModule, JwtModule.register({})],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('strategy validate(): should call service getAccountByEmail()', async () => {
    authService.getAccountByEmail = jest.fn().mockResolvedValue(fakeAccount);
    const account = await jwtStrategy.validate({ email: 'some@email.com' });
    expect(authService.getAccountByEmail).toBeCalledWith('some@email.com');
    expect(account).toStrictEqual(fakeAccount);
  });
});

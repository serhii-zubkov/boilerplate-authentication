import { Test, TestingModule } from '@nestjs/testing';
import { fakeAuthLoginDto, fakeAuthRegisterDto } from 'tests';
import { Account } from 'modules/crud/users/entities';
import { AuthRegisterDto } from './dto';

jest.mock('./auth.service');
jest.mock('modules/crud/users/accounts.service');

import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'modules/crud/users/users.module';
import { AuthService } from './auth.service';
import { AccountsService } from 'modules/crud/users/accounts.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

describe('Check auth.service.ts', () => {
  let authController: AuthController;
  let authService: AuthService;
  let accountsService: AccountsService;

  const fakeAccount = new Account();
  fakeAccount.account_id = 1;
  fakeAccount.email = 'johndoe@gmail.com';
  fakeAccount.password_hash = 'some-password-hash';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PassportModule, JwtModule.register({})],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('controller login(): should call service login()', async () => {
    authService.validateAccount = jest.fn().mockResolvedValue(true);
    authService.login = jest.fn().mockResolvedValue({
      access_token: 'some-access-token',
    });
    fakeAccount.loadUsers = jest.fn();
    accountsService.findOneByEmail = jest.fn().mockResolvedValue(fakeAccount);

    const result = await authController.login(fakeAuthLoginDto);

    expect(authService.login).toBeCalledWith(fakeAuthLoginDto);
    expect(accountsService.findOneByEmail).toBeCalledWith(
      fakeAuthLoginDto.email,
    );
    expect(fakeAccount.loadUsers).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      access_token: 'some-access-token',
      account: fakeAccount.dto,
    });
  });

  it('controller login(): unauthorized exception', async () => {
    authService.validateAccount = jest.fn().mockResolvedValue(false);
    try {
      await authController.login(fakeAuthLoginDto);
    } catch (e) {
      expect(e).toStrictEqual(new UnauthorizedException());
    }
  });

  it('controller register(): should call service register()', async () => {
    authService.validatePassword = jest.fn().mockResolvedValue(true);
    authService.getAccountByEmail = jest.fn().mockResolvedValue(false);
    authService.register = jest.fn().mockResolvedValue(fakeAccount);

    const result = await authController.register(fakeAuthRegisterDto);

    expect(authService.validatePassword).toBeCalledWith(
      fakeAuthRegisterDto.password,
    );
    expect(authService.getAccountByEmail).toBeCalledWith(
      fakeAuthRegisterDto.email,
    );
    expect(authService.register).toBeCalledWith(fakeAuthRegisterDto);
    expect(result).toStrictEqual({
      account: fakeAccount.dto,
    });
  });

  it('controller register(): exception - password and confirmation_password should be equal', async () => {
    try {
      await authController.register({
        password: '123',
        confirmation_password: '12345',
      } as AuthRegisterDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('controller register(): exception - password should be stronger', async () => {
    authService.validatePassword = jest.fn().mockReturnValue(false);
    try {
      await authController.register(fakeAuthRegisterDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('controller register(): exception - email is already using', async () => {
    authService.validatePassword = jest.fn().mockResolvedValue(true);
    authService.getAccountByEmail = jest.fn().mockResolvedValue(fakeAccount);
    try {
      await authController.register(fakeAuthRegisterDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});

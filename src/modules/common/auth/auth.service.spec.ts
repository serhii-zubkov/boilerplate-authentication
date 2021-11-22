import { Test, TestingModule } from '@nestjs/testing';
import {
  fakeAccount,
  fakeAuthLoginDto,
  fakeAuthRegisterDto,
  mockModels,
  mockAllRepositories,
} from 'tests';

jest.mock('modules/crud/users/accounts.service');
jest.mock('modules/crud/users/users.service');
const spyModels = mockModels();
const spyRepositories = mockAllRepositories();

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'modules/crud/users/users.module';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AccountsService } from 'modules/crud/users/accounts.service';
import { UsersService } from 'modules/crud/users/users.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

describe('Check auth.service.ts', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let accountsService: AccountsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PassportModule, JwtModule.register({})],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    accountsService = module.get<AccountsService>(AccountsService);
    usersService = module.get<UsersService>(UsersService);

    spyModels.mockClearAll();
    spyRepositories.mockClearAll();
  });

  it('auth service getAccountByEmail() method', async () => {
    accountsService.findOneByEmail = jest.fn().mockResolvedValue(fakeAccount);
    const account = await authService.getAccountByEmail(fakeAccount.email);
    expect(account).toStrictEqual(fakeAccount);
  });

  it('auth service validateAccount() method', async () => {
    accountsService.findOneByEmail = jest.fn().mockResolvedValue(fakeAccount);
    const result = await authService.validateAccount(fakeAuthLoginDto);
    expect(result).toBeTruthy();
  });

  it('auth service validatePassword() method', () => {
    expect(authService.validatePassword('123')).toBeTruthy();
  });

  it('auth service login() method', async () => {
    jwtService.sign = jest.fn().mockReturnValue('some-access-token');
    const result = await authService.login(fakeAuthLoginDto);
    expect(jwtService.sign).toBeCalledWith(fakeAuthLoginDto);
    expect(result).toStrictEqual({
      access_token: 'some-access-token',
    });
  });

  it('auth service register() method', async () => {
    accountsService.create = jest.fn().mockResolvedValue(fakeAccount);
    usersService.create = jest.fn();
    fakeAccount.loadUsers = jest.fn();
    const account = await authService.register(fakeAuthRegisterDto);

    expect(accountsService.create).toBeCalledWith({
      email: fakeAuthRegisterDto.email,
      password: fakeAuthRegisterDto.password,
      confirmation_password: fakeAuthRegisterDto.confirmation_password,
    });

    expect(usersService.create).toBeCalledWith({
      account_id: account.account_id,
      first_name: fakeAuthRegisterDto.first_name,
      last_name: fakeAuthRegisterDto.last_name,
      gender: fakeAuthRegisterDto.gender,
      height: fakeAuthRegisterDto.height,
      weight: fakeAuthRegisterDto.weight,
      sports: fakeAuthRegisterDto.sports,
      goals: fakeAuthRegisterDto.goals,
      date_of_birth: fakeAuthRegisterDto.date_of_birth,
    });

    expect(fakeAccount.loadUsers).toBeCalledTimes(1);

    expect(account).toStrictEqual(fakeAccount);
  });
});

describe('Check auth.module.ts', () => {
  it('AuthModule class should be defined', () => {
    expect(AuthModule).toBeDefined();
  });
});

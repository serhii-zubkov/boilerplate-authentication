import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'modules/crud/users/users.service';
import { User } from 'modules/crud/users/entities';
import { CreateUserDto } from 'modules/crud/users/dto';
import { AuthLoginDto, AuthRegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  static async validatePassword(password: string) {
    // To-do: is there any requirements for passwords?
    return true; // Allows all the passwords for now.
  }

  async checkUser(authLogin: AuthLoginDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(authLogin.email);
    if (user) {
      return (await AuthService.comparePassword(
        authLogin.password,
        user.passwordHash,
      ))
        ? user
        : null;
    }

    return null;
  }

  async createUserToken(authLogin: AuthLoginDto): Promise<string> {
    return this.jwtService.sign(authLogin);
  }

  async registerUser(authRegister: AuthRegisterDto): Promise<User> {
    const userDto: CreateUserDto = {
      email: authRegister.email,
      password: authRegister.password,
      firstName: authRegister.firstName,
      lastName: authRegister.lastName,
    };
    return this.usersService.create(userDto);
  }
}

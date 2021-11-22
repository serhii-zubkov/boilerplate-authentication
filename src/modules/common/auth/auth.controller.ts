import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerAuthorizedPostRequest } from 'decorators';
import { fakeUser } from 'tests';
import { AuthService } from './auth.service';
import { UsersService } from 'modules/crud/users/users.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('auth/login')
  @SwaggerAuthorizedPostRequest(
    {
      token: 'bearer-access-token',
      user: fakeUser.dto,
    },
    'Authorized with Bearer key',
  )
  async login(@Body() authLogin: AuthLoginDto) {
    const user = await this.authService.checkUser(authLogin);

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.createUserToken(authLogin);

    return {
      token,
      user: user.dto,
    };
  }

  @Post('auth/register')
  @SwaggerAuthorizedPostRequest(fakeUser.dto, 'User is successfully registered')
  async register(@Body() authRegister: AuthRegisterDto) {
    if (authRegister.password !== authRegister.confirmationPassword) {
      throw new HttpException(
        'password and confirmation_password should be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!AuthService.validatePassword(authRegister.password)) {
      throw new HttpException(
        'password should be stronger',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.usersService.findOneByEmail(authRegister.email)) {
      throw new HttpException('email is already using', HttpStatus.BAD_REQUEST);
    }

    const user = await this.authService.registerUser(authRegister);
    return user.dto;
  }
}

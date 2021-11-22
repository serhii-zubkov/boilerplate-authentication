import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @ApiResponse({
    status: 201,
    description: 'Authorized with Bearer key.',
    schema: {
      example: {
        token: 'bearer-access-token',
        user: {
          userId: 1,
          email: 'admin@gmail.com',
          firstName: 'Admin',
          lastName: 'Admin',
          roles: ['admin'],
          created: '2021-11-22T07:41:01.518Z',
          updated: '2021-11-22T07:41:01.518Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('auth/login')
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

  @ApiResponse({
    status: 201,
    description: 'User is successfully registered.',
    schema: {
      example: {
        user: {
          userId: 1,
          email: 'admin@gmail.com',
          firstName: 'Admin',
          lastName: 'Admin',
          roles: ['admin'],
          created: '2021-11-22T07:41:01.518Z',
          updated: '2021-11-22T07:41:01.518Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('auth/register')
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

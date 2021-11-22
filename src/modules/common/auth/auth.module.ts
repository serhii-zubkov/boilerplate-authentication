import { Module } from '@nestjs/common';
import { ConfigurationService } from 'modules/common/config/config.service';
import { UsersModule } from 'modules/crud/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

const config = new ConfigurationService();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register(config.get('auth')),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}

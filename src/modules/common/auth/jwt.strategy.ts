import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'modules/crud/users/users.service';
import { ConfigurationService } from 'modules/common/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get<{ secret: string }>('auth').secret,
    });
  }

  async validate(payload) {
    const account = await this.usersService.findOneByEmail(payload.email);
    return account;
  }
}

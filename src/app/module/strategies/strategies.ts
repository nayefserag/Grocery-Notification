import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/app/shared/module/config-module/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getString('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // You can add additional user validation logic here
    return { userId: payload.sub, username: payload.username };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'stairslife-super-secret-key-ganti-ini-nanti',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
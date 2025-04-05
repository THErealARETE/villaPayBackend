import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategy } from '../enums';
import { JWTUser } from '../entities';

@Injectable()
export class UserAuthJwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.USER,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('auth.accessToken.secret'),
    });
  }

  async validate(payload: JWTUser) {
    return payload;
  }
}

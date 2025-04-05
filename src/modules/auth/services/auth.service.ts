import { ENV_KEYS } from '@/common/constants';
import { formatErrorLog } from '@/common/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verifyIdToken } from 'apple-signin-auth';
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';

import { JWTUser } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  // -------------------------------------------------------
  // CREATE AUTH ACCESS TOKEN
  // -------------------------------------------------------

  async createAccessToken(payload: JWTUser) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>(
        ENV_KEYS.AUTH_ACCESS_TOKEN_EXPIRES_IN,
      ),
      secret: this.configService.getOrThrow<string>(
        ENV_KEYS.AUTH_ACCESS_TOKEN_SECRET,
      ),
    });
  }

  // -------------------------------------------------------
  // HASH PASSWORD
  // -------------------------------------------------------

  async hashPassword(password: string) {
    return argon2.hash(password);
  }

  // -------------------------------------------------------
  // GENERATE OTP
  // -------------------------------------------------------
  generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  // -------------------------------------------------------
  // COMPARE PASSWORD WITH HASHED PASSWORD
  // -------------------------------------------------------

  async passwordIsMatch(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }

  // -------------------------------------------------------
  // VERIFY APPLE ID TOKEN
  // -------------------------------------------------------

  async verifyAppleIdToken(idToken: string) {
    try {
      const result = await verifyIdToken(idToken, {
        audience: this.configService.getOrThrow<string>(
          ENV_KEYS.AUTH_APPLE_CLIENT_ID,
        ),
      });

      return result;
    } catch (err) {
      this.logger.error(formatErrorLog(err), '@verifyAppleIdToken');
      return null;
    }
  }

  // -------------------------------------------------------
  // VERIFY GOOGLE ID TOKEN
  // -------------------------------------------------------
  async verifyGoogleIdToken(idToken: string) {
    try {
      const client = new OAuth2Client(
        this.configService.getOrThrow<string>(ENV_KEYS.AUTH_GOOGLE_CLIENT_ID),
        this.configService.getOrThrow<string>(
          ENV_KEYS.AUTH_GOOGLE_CLIENT_SECRET,
        ),
      );

      const ticket = await client.verifyIdToken({
        idToken,
      });

      return ticket.getPayload();
    } catch (err) {
      this.logger.error(formatErrorLog(err), '@verifyGoogleIdToken');
      return null;
    }
  }
}

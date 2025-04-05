import {
  Body,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorMessage } from '@/common/enums';
import { DateService } from '@/common/services';
import { PASSWORD_OTP_EXPIRATION_MINUTES } from '@/modules/auth/constants';
import { AuthService } from '@/modules/auth/services';
import { AuthProvider } from '@/modules/auth/enums';
import {
  UserForgotPasswordApprovalDto,
  UserForgotPasswordCompleteDto,
  UserForgotPasswordDto,
  UserLoginDto,
  UserSignupDto,
  UserSocialSigninDto,
} from '../dto';
import { UserService } from './user.service';
import { User } from '../repository/entities/user.entity';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(UserAuthService.name);

  // -------------------------------------------------------
  // USER AUTH CREDENTIAL LOGIN
  // -------------------------------------------------------

  async login({ email, password }: UserLoginDto) {
    const errorMessage = 'Email or password is incorrect';

    const userRecord = await this.userService.findOneByEmail(email);

    if (!userRecord || userRecord.authProvider !== AuthProvider.CREDENTIALS) {
      throw new ForbiddenException(errorMessage);
    }

    const passwordIsMatch = userRecord.password
      ? await this.authService.passwordIsMatch(password, userRecord.password)
      : false;

    if (!passwordIsMatch) {
      throw new ForbiddenException(errorMessage);
    }

    return this.loginHelper(userRecord);
  }

  // -------------------------------------------------------
  // USER AUTH CREDENTIAL SIGNUP
  // -------------------------------------------------------

  async signup({ email, firstName, lastName, password, phone }: UserSignupDto) {
    const emailExists = await this.userService.isExistingEmail(email);
    if (emailExists) {
      throw new ConflictException(ErrorMessage.AUTH_CONFLICT_EMAIL);
    }
    if (phone) {
      const phoneExists = await this.userService.isExistingPhone(phone);
      if (phoneExists) {
        throw new ConflictException(ErrorMessage.AUTH_CONFLICT_PHONE);
      }
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const newUser = await this.userService.createUser({
      authProvider: AuthProvider.CREDENTIALS,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
    });

    return this.loginHelper(newUser);
  }

  // -------------------------------------------------------
  // USER AUTH APPLE SIGNIN
  // -------------------------------------------------------

  async appleSignIn(@Body() dto: UserSocialSigninDto) {
    const appleUser = await this.authService.verifyAppleIdToken(dto.idToken);
    if (!appleUser) {
      throw new NotFoundException(ErrorMessage.AUTH_SOCIAL_ACCOUNT_NOT_FOUND);
    }
    if (!appleUser.email) {
      throw new NotFoundException(ErrorMessage.AUTH_SOCIAL_EMAIL_MISSING);
    }
    return this.socialSignInHelper({
      authProvider: AuthProvider.APPLE,
      socialUser: { email: appleUser.email, sub: appleUser.sub },
    });
  }

  // -------------------------------------------------------
  // USER AUTH GOOGLE SIGNIN
  // -------------------------------------------------------

  async googleSignIn(@Body() dto: UserSocialSigninDto) {
    const googleUser = await this.authService.verifyGoogleIdToken(dto.idToken);
    if (!googleUser) {
      throw new NotFoundException(ErrorMessage.AUTH_SOCIAL_ACCOUNT_NOT_FOUND);
    }
    if (!googleUser.email) {
      throw new NotFoundException(ErrorMessage.AUTH_SOCIAL_EMAIL_MISSING);
    }
    return this.socialSignInHelper({
      authProvider: AuthProvider.GOOGLE,
      socialUser: {
        email: googleUser.email,
        name:
          googleUser.name || googleUser.given_name || googleUser.family_name,
        sub: googleUser.sub,
      },
    });
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD REQUEST
  //  ------------------------------------------------------

  async forgotPasswordRequest(@Body() dto: UserForgotPasswordDto) {
    const userRecord = await this.userService.findOneByEmail(dto.email);

    if (!userRecord || userRecord.authProvider !== AuthProvider.CREDENTIALS) {
      throw new ForbiddenException(ErrorMessage.AUTH_INVALID_CREDENTIALS_ERROR);
    }

    const otp = this.authService.generateOtp();

    await this.userService.updateUser(userRecord.id, {
      forgotPasswordOtp: otp,
      forgotPasswordExpiresAt: this.dateService
        .nowUtc()
        .plus({ minutes: PASSWORD_OTP_EXPIRATION_MINUTES })
        .toJSDate(),
    });

    return true;
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD RESEND OTP
  //  ------------------------------------------------------

  async forgotPasswordRequestResendOtp(@Body() dto: UserForgotPasswordDto) {
    const userRecord = await this.userService.findOneByEmail(dto.email);

    if (
      !userRecord ||
      userRecord.authProvider !== AuthProvider.CREDENTIALS ||
      !userRecord.forgotPasswordOtp
    ) {
      throw new ForbiddenException(ErrorMessage.AUTH_INVALID_CREDENTIALS_ERROR);
    }

    const otp = this.authService.generateOtp();

    await this.userService.updateUser(userRecord.id, {
      forgotPasswordOtp: otp,
      forgotPasswordExpiresAt: this.dateService
        .nowUtc()
        .plus({ minutes: PASSWORD_OTP_EXPIRATION_MINUTES })
        .toJSDate(),
    });

    return true;
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD APPROVAL
  //  ------------------------------------------------------

  async forgotPasswordRequestApproval(
    @Body() dto: UserForgotPasswordApprovalDto,
  ) {
    const userRecord = await this.userService.findOneByEmail(dto.email);

    if (!userRecord || userRecord.forgotPasswordOtp !== dto.otp) {
      throw new ForbiddenException(ErrorMessage.AUTH_INVALID_CREDENTIALS_ERROR);
    }

    const otpHasExpired = userRecord.forgotPasswordExpiresAt
      ? this.dateService.isAfter(
          this.dateService.nowUtc(),
          this.dateService.fromJSDate(userRecord.forgotPasswordExpiresAt),
        )
      : true;
    if (otpHasExpired) {
      throw new ForbiddenException(ErrorMessage.OTP_EXPIRED);
    }

    await this.userService.updateUser(userRecord.id, {
      forgotPasswordIsApproved: true,
    });

    return true;
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD COMPLETE
  //  ------------------------------------------------------

  async forgotPasswordRequestComplete(
    @Body() dto: UserForgotPasswordCompleteDto,
  ) {
    const userRecord = await this.userService.findOneByEmail(dto.email);

    if (
      !userRecord ||
      userRecord.forgotPasswordOtp !== dto.otp ||
      !userRecord.forgotPasswordIsApproved
    ) {
      throw new ForbiddenException(ErrorMessage.AUTH_INVALID_CREDENTIALS_ERROR);
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);

    await this.userService.updateUser(userRecord.id, {
      forgotPasswordIsApproved: false,
      forgotPasswordExpiresAt: undefined,
      forgotPasswordOtp: undefined,
      password: hashedPassword,
    });

    return true;
  }

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------

  private async loginHelper(user: User) {
    const accessToken = await this.authService.createAccessToken({
      sub: user.id,
    });

    return {
      tokens: { accessToken },
      user: {
        email: user.email,
        firstName: user.firstName,
        hasVerifiedEmail: user.hasVerifiedEmail,
        hasVerifiedPhone: user.hasVerifiedPhone,
      },
    };
  }

  // -------------------------------------------------------
  // SOCIAL SIGNIN
  // -------------------------------------------------------

  private async socialSignInHelper({
    authProvider,
    socialUser,
  }: {
    authProvider: AuthProvider;
    socialUser: { email: string; name?: string; sub: string };
  }) {
    const userRecord = await this.userService.findOneByAny([
      { email: socialUser.email },
      { authProvider, socialAuthId: socialUser.sub },
    ]);

    if (!userRecord) {
      const newUser = await this.userService.createUser({
        authProvider,
        email: socialUser.email,
        firstName: socialUser.name || socialUser.email,
        lastName: socialUser.name || socialUser.email,
        socialAuthId: socialUser.sub,
      });

      return this.loginHelper(newUser);
    }

    if (
      userRecord.email === socialUser.email &&
      userRecord.authProvider !== authProvider
    ) {
      throw new ConflictException(ErrorMessage.AUTH_CONFLICT_EMAIL);
    }

    if (userRecord.socialAuthId && userRecord.authProvider !== authProvider) {
      throw new ConflictException(ErrorMessage.AUTH_CONFLICT_SOCIAL_ACCOUNT);
    }

    return this.loginHelper(userRecord);
  }
}

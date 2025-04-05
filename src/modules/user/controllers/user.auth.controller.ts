import { Body, Controller, Post } from '@nestjs/common';

import { createControllerResponse } from '@/common/helpers';
import {
  UserForgotPasswordApprovalDto,
  UserForgotPasswordCompleteDto,
  UserForgotPasswordDto,
  UserLoginDto,
  UserSignupDto,
  UserSocialSigninDto,
} from '../dto';
import { UserAuthLoginResponse } from '../entities';
import { UserAuthService } from '../services';

@Controller()
export class UserAuthController {
  constructor(private readonly service: UserAuthService) {}

  // -------------------------------------------------------
  // USER AUTH CREDENTIAL LOGIN
  // -------------------------------------------------------

  @Post('credentials/login')
  async login(
    @Body()
    dto: UserLoginDto,
  ) {
    const result = await this.service.login(dto);
    return createControllerResponse<UserAuthLoginResponse>({ data: result });
  }

  // -------------------------------------------------------
  // USER AUTH CREDENTIAL SIGNUP
  // -------------------------------------------------------

  @Post('credentials/signup')
  async signup(
    @Body()
    dto: UserSignupDto,
  ) {
    const result = await this.service.signup(dto);
    return createControllerResponse<UserAuthLoginResponse>({ data: result });
  }

  // -------------------------------------------------------
  // USER AUTH APPLE SIGNIN
  // -------------------------------------------------------

  @Post('apple/signin')
  async appleSignIn(
    @Body()
    dto: UserSocialSigninDto,
  ) {
    const result = await this.service.appleSignIn(dto);
    return createControllerResponse<UserAuthLoginResponse>({ data: result });
  }

  // -------------------------------------------------------
  // USER AUTH GOOGLE SIGNIN
  // -------------------------------------------------------

  @Post('google/signin')
  async googleSignIn(
    @Body()
    dto: UserSocialSigninDto,
  ) {
    const result = await this.service.googleSignIn(dto);
    return createControllerResponse<UserAuthLoginResponse>({ data: result });
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD REQUEST
  //  ------------------------------------------------------

  @Post('initiate-forgot-password')
  async forgotPasswordRequest(
    @Body()
    dto: UserForgotPasswordDto,
  ) {
    await this.service.forgotPasswordRequest(dto);
    return createControllerResponse({ data: null });
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD RESEND OTP
  //  ------------------------------------------------------

  @Post('resend-forgot-password-otp')
  async forgotPasswordRequestResendOtp(
    @Body()
    dto: UserForgotPasswordDto,
  ) {
    await this.service.forgotPasswordRequestResendOtp(dto);
    return createControllerResponse({ data: null });
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD APPROVAL
  //  ------------------------------------------------------

  @Post('verify-forgot-password-otp')
  async forgotPasswordRequestApproval(
    @Body()
    dto: UserForgotPasswordApprovalDto,
  ) {
    await this.service.forgotPasswordRequestApproval(dto);
    return createControllerResponse({ data: null });
  }

  //  ------------------------------------------------------
  //  USER AUTH FORGOT PASSWORD COMPLETE
  //  ------------------------------------------------------

  @Post('complete-forgot-password')
  async forgotPasswordRequestComplete(
    @Body()
    dto: UserForgotPasswordCompleteDto,
  ) {
    await this.service.forgotPasswordRequestComplete(dto);
    return createControllerResponse({ data: null });
  }
}

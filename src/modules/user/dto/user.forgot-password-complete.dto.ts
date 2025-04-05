import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserForgotPasswordApprovalDto } from './user.forgot-password-approval.dto';
import { UserLoginDto } from './user.login.dto';

export class UserForgotPasswordCompleteDto extends IntersectionType(
  UserForgotPasswordApprovalDto,
  PickType(UserLoginDto, ['password']),
) {}

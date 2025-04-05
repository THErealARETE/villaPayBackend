import { IsNotEmpty, IsString } from 'class-validator';
import { UserForgotPasswordDto } from './user.forgot-password.dto';

export class UserForgotPasswordApprovalDto extends UserForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly otp: string;
}

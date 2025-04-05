import { UserSignupDto } from './user.signup.dto';
import { AuthProvider } from '@/modules/auth/enums';
import { OmitType } from '@nestjs/swagger';

export class UserCreateDto extends OmitType(UserSignupDto, ['password']) {
  readonly authProvider: AuthProvider;
  readonly hasVerifiedEmail?: boolean;
  readonly hasVerifiedPhone?: boolean;
  readonly password?: string;
  readonly socialAuthId?: string;
}

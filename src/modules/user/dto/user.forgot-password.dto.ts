import { PickType } from '@nestjs/swagger';

import { UserSignupDto } from './user.signup.dto';

export class UserForgotPasswordDto extends PickType(UserSignupDto, ['email']) {}

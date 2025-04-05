import { IsNotEmpty, IsString } from 'class-validator';

export class UserSocialSigninDto {
  @IsString()
  @IsNotEmpty()
  readonly idToken: string;
}

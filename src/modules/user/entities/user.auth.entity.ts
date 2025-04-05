export class UserAuthLoginResponse {
  tokens: {
    accessToken: string;
  };
  user: {
    email: string;
    firstName: string;
    hasVerifiedEmail: boolean;
    hasVerifiedPhone: boolean;
  };
}

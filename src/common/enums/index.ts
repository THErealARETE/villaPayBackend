export enum ErrorMessage {
  AUTH_CONFLICT_EMAIL = 'This email is already associated with an account',
  AUTH_CONFLICT_PHONE = 'This phone number is already associated with an account',
  AUTH_CONFLICT_SOCIAL_ACCOUNT = 'This social account already exists',
  AUTH_INVALID_CREDENTIALS_ERROR = 'Invalid credentials',
  AUTH_INVALID_SOCIAL_ID_TOKEN = 'Invalid ID token',
  AUTH_SOCIAL_ACCOUNT_NOT_FOUND = 'Social account does not exist',
  AUTH_SOCIAL_EMAIL_MISSING = 'Social account email is missing',
  AUTH_SOCIAL_EMAIL_UNVERIFIED = 'Social account email is not verified',
  BAD_REQUEST = 'Validation errors in your request',
  INTERNAL_SERVER_ERROR = 'Something is broken',
  INVALID_SOCIAL_ERROR = 'Invalid credentials',
  OTP_EXPIRED = 'OTP has expired',
}

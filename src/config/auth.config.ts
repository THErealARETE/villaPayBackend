import { registerAs } from '@nestjs/config';

type AuthConfigOptions = {
  accessToken: {
    expiresIn: string;
    secret: string;
  };
  apple: {
    clientId: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
};

export default registerAs(
  'auth',
  (): AuthConfigOptions => ({
    accessToken: {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN as string,
      secret: process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }),
);

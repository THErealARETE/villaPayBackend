import { registerAs } from '@nestjs/config';

type DBConfigOptions = {
  uri: string;
};

export default registerAs(
  'db',
  (): DBConfigOptions => ({
    uri: process.env.DATABASE_URI as string,
  }),
);

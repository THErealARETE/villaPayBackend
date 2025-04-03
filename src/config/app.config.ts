import { registerAs } from '@nestjs/config';

type AppConfigOptions = {
  globalPrefix: string;
  http: { port: number };
  nodeEnv: string;
  versioning: { prefix: string; version: string };
};

export default registerAs(
  'app',
  (): AppConfigOptions => ({
    globalPrefix: '/api',
    http: {
      port: Number.parseInt(process.env.PORT as string, 10),
    },
    nodeEnv: process.env.NODE_ENV || 'development',
    versioning: {
      prefix: 'v',
      version: '1',
    },
  }),
);

import { ENV_KEYS } from '@/common/constants';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        logging: ['error', 'schema'],
        synchronize:
          configService.getOrThrow(ENV_KEYS.APP_NODE_ENV) === 'development',
        type: 'postgres',
        url: configService.getOrThrow(ENV_KEYS.DATABASE_URI),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

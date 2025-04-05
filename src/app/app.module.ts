import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  HttpLoggerMiddleware,
  TrimRequestBodyMiddleware,
} from '@/common/middlewares';
import { HttpExceptionFilter } from '@/common/filters';
import { CommonModule } from '@/common/common.module';
import { DatabaseModule } from '@/database/database.module';
import { RouterModule } from '@/router/router.module';

@Module({
  imports: [CommonModule, DatabaseModule, RouterModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware, TrimRequestBodyMiddleware)
      .forRoutes('*');
  }
}

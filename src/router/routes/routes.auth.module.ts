import { Module } from '@nestjs/common';

import { DateService } from '@/common/services';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserAuthController } from '@/modules/user/controllers';
import { UserModule } from '@/modules/user/user.module';
import { UserAuthService } from '@/modules/user/services';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UserAuthController],
  providers: [DateService, UserAuthService],
  exports: [],
})
export class RoutesAuthModule {}

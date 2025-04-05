import { OmitType, PartialType } from '@nestjs/swagger';

import { User } from '../repository/entities/user.entity';

export class UserUpdateDto extends PartialType(
  OmitType(User, ['createdAt', 'id', 'updatedAt']),
) {}

import { Column, Entity, Index } from 'typeorm';

import { DatabaseBaseUUIDEntity } from '@/database/entities';
import { AuthProvider } from '@/modules/auth/enums';

@Entity()
export class User extends DatabaseBaseUUIDEntity {
  @Column({ enum: AuthProvider, type: 'enum' })
  authProvider: AuthProvider;

  @Index()
  @Column({
    unique: true,
    type: 'citext',
  })
  email: string;

  @Column({
    length: 50,
  })
  firstName: string;

  @Column({
    default: false,
  })
  hasVerifiedEmail: boolean;

  @Column({
    default: false,
  })
  hasVerifiedPhone: boolean;

  @Column({
    length: 50,
  })
  lastName: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    length: 30,
    nullable: true,
    unique: true,
  })
  phone?: string;

  @Column({ nullable: true })
  socialAuthId?: string;

  //   MISC
  @Column({ default: false })
  forgotPasswordIsApproved: boolean;

  @Column({ length: 10, nullable: true })
  forgotPasswordOtp?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  forgotPasswordExpiresAt?: Date;
}

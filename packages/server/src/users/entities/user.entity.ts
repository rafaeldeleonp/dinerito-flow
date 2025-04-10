import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id!: number;
  email!: string;

  @Exclude()
  password: string;

  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

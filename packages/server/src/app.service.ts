import { ErrorCode } from '@dinerito-flow/shared';
import { Injectable, NotFoundException } from '@nestjs/common';

import { EmailService } from './email/email.service';
import { EmailTemplates } from './email/types';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService
  ) {}

  async getHello(email: string): Promise<boolean> {
    const user = await this.usersService.findOne(email);

    if (!user) throw new NotFoundException({ errorCode: ErrorCode.EMAIL_NOT_FOUND });

    return this.emailService.send(email, EmailTemplates.WELCOME, { name: `${user.firstName} ${user.lastName}` });
  }
}

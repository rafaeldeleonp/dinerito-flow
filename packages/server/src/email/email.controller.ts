import { SendWelcomeEmailDto } from '@dinerito-flow/shared';
import { Body, Controller, Post } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  async create(@Body() sendWelcomeEmailDto: SendWelcomeEmailDto): Promise<boolean> {
    return this.emailService.sendWelcomeEmail(sendWelcomeEmailDto.to, sendWelcomeEmailDto.name);
  }
}

import { Module } from '@nestjs/common';

import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

import { VerificationCodesController } from './verification-codes.controller';
import { VerificationCodesService } from './verification-codes.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VerificationCodesController],
  providers: [EmailService, UsersService, VerificationCodesService],
})
export class VerificationCodesModule {}

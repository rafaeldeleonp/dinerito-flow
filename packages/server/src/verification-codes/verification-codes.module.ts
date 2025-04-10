import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VerificationCodesService } from './verification-codes.service';
import { VerificationCodesController } from './verification-codes.controller';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VerificationCodesController],
  providers: [EmailService, VerificationCodesService],
})
export class VerificationCodesModule {}

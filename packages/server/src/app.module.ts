import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import environment from './config/environment';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { VerificationCodesModule } from './verification-codes/verification-codes.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [environment],
      isGlobal: true,
    }),
    DatabaseModule,
    EmailModule,
    UsersModule,
    VerificationCodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

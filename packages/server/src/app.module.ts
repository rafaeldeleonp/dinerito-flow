import * as path from 'path';

import { DEFAULT_LANGUAGE } from '@dinerito-flow/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import environment from './config/environment';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
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
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path:
          process.env.NODE_ENV === 'production'
            ? path.join(__dirname, 'i18n/') // This points to dist/i18n after build
            : path.join(__dirname, './email/i18n/'), // This is for development
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
      typesOutputPath: path.join(__dirname, 'generated/i18n.generated.ts'),
    }),
    UsersModule,
    VerificationCodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

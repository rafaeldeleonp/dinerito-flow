import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './errors.interceptor';
import { RequestLoggerInterceptor } from './request-logger.interceptor';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'DineritoFlow - Server',
    }),
  });

  app.enableCors();
  app.useGlobalInterceptors(new RequestLoggerInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(parseInt(process.env.PORT || '3000', 10), '0.0.0.0');
}

bootstrap();

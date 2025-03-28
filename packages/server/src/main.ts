import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'DineritoFlow - Server',
    }),
  });

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

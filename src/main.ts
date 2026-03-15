import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('auth-ms');
  await app.listen(envs.port, () => {
    logger.log(`Auth microservice is running on port ${envs.port}`);
  });
}

bootstrap();

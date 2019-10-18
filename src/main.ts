import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.useGlobalInterceptors(new ErrorsInterceptor());
  await app.listen(3000);
}
bootstrap();

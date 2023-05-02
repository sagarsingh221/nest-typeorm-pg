import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { setupSwagger } from 'src/utils/swagger';
import { TransformInterceptor } from 'src/interceptors';
import winston from './logger/winston';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format,
      transports: winston.transports,
      exitOnError: false,
    }),
  });
  const APP_URL = `${AppModule.hostname}:${AppModule.port}`;

  app.enableCors();
  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  if (!AppModule.isProduction) {
    setupSwagger(app, APP_URL);
  }

  await app.listen(AppModule.port, () =>
    logger.verbose(`App started on port: ${AppModule.port}`),
  );
}
bootstrap();

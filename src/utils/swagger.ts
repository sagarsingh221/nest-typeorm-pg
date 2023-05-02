import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

export function setupSwagger(app: INestApplication, APP_URL: string): void {
  const docs_path = 'docs';
  const options = new DocumentBuilder()
    .setTitle('Salary-M24 Documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  Logger.verbose(`Docs availble at ${APP_URL}/${docs_path}`);
}

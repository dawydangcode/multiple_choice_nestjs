declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { throwError } from './common/utils/function';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/utils/filter/all-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'logs/app.log',
          format: winston.format.json(),
        }),
        new winston.transports.Console(),
      ],
    }),
  });
  // app.useGlobalFilters(new AllExceptionsFilter());
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = app.get(ConfigService).get<number>('app.port') ?? throwError();
  app.use(cookieParser());
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}

function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Intern Hired')
    .setDescription('Description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, documentFactory);
}

bootstrap();

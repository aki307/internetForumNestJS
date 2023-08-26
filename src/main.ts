import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { NestExpressApplication } from '@nestjs/platform-express';
//viewファイル用
import { join } from 'path';
const hbs = require ('hbs');
import * as session from 'express-session';

async function bootstrap() {
  // 追記
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 追記
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  app.setViewEngine('hbs');


  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  app.use(cookieParser());

  // 追記
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    }),
  );

  await app.listen(3011);
}
bootstrap();

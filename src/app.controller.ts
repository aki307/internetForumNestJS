import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  index() {
    return {
      title: 'NestJS-MVC',
      message: 'NestJS + hbs = MVC application!!!'
    }
  }

  @Get('register')
  @Render('register')
  register() {
    return {
      title: 'NestJS-MVC',
      message: 'NestJS + hbs = MVC application!!!'
    }
  }


}

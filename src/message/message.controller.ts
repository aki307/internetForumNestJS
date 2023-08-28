import { Body, Controller, Get, Patch, Render, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MessageService } from './message.service';
import { User } from '@prisma/client';
import { Message } from '@prisma/client';
// 追記
import { CustomAuthGuard } from '../guards/custom-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';

// @UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService,
    ){} 
  @Get()
  @UseGuards(CustomAuthGuard)
  @Render('postMyMessage')
  getMessage(@GetUser() user: User): object {
    return {
      message: user,
      user, // ログインユーザー情報が含まれる
    };
  }

}

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from '@prisma/client';
import { Message } from '@prisma/client';
// 追記
import { CustomAuthGuard } from '../guards/custom-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,
  ) { }
  @Get()
  getMessages(@Req() req: Request): Promise<Message[]> {
    return this.messageService.getMessages(req.user.id);
  }

  @Get(':id')
  getMessageById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) messageId: number,
  ): Promise<Message> {
    return this.messageService.getMessageById(req.user.id, messageId);
  }

  @Post()
  createMessage(@Req() req: Request, @Body() dto: CreateMessageDto): Promise<Message> {
    return this.messageService.createMessage(req.user.id, dto);
  }

  @Patch(':id')
  updateMessageById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) messageId: number,
    @Body() dto: UpdateMessageDto,
  ): Promise<Message> {
    return this.messageService.UpdateMessageById(req.user.id, messageId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMessageById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) messageId: number,
  ): Promise<void | ForbiddenException> {
    return this.messageService.deleteMessageById(req.user.id, messageId);
  }

}


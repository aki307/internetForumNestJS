import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
    
    constructor(private prisma: PrismaService){}

    getMessages(userId: number): Promise<Message[]>{
        return this.prisma.message.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
    }

    getMessageById(userId: number, messageId: number):Promise<Message>{
        return this.prisma.message.findFirst({
            where: {
                userId,
                id: messageId,
            },
        });
    }

    async createMessage(userId: number, dto: CreateMessageDto) :Promise<Message>{
        const message = await this.prisma.message.create({
            data: {
                userId,
                ...dto,
            },
        });
        return message;
    }

    async UpdateMessageById(
        userId: number,
        messageId: number,
        dto: UpdateMessageDto,
    ): Promise<Message>{
        const message = await this.prisma.message.findUnique({
            where: {
                id: messageId,
            },
        });

        if(!message || message.userId !== userId){
            throw new ForbiddenException('No permission to update');
        }
        return this.prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                ...dto,
            },
        });

    }

    async deleteMessageById(userId: number, messageId: number){
        const message = await this.prisma.message.findUnique({
            where: {
                id: messageId,
            },
        });

        if(!message || message.userId !== userId) {
            throw new ForbiddenException('No permission to delete');
        }
        await this.prisma.message.delete({
            where: {
                id: messageId,
            }
        })

    }
}

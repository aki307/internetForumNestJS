import { Injectable } from '@nestjs/common';

// 追記
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
    // 追記
    constructor(private prisma: PrismaService){}
}

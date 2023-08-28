import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get()
    getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
        return req.user;
    }
}

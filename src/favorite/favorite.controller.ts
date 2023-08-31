import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    Req,
    ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FavoriteService } from './favorite.service';
import { Favorites } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @Get(':id')
    getFavoriteByMessageId(
        @Req() req: Request,
        @Param('id', ParseIntPipe) messageId: number,
    ): Promise<Favorites[]> {
        return this.favoriteService.getFavoritesByMessageId(messageId);
    }

    @Post(':id')
    favoriteByMessageId(
        @Req() req: Request,
        @Param('id', ParseIntPipe) messageId: number,
    ): Promise<Favorites | ForbiddenException> {
        return this.favoriteService.favoriteByMessageId(req.user.id, messageId);
    }

    @Delete(':id')
    unFavoriteByMessageId(
        @Req() req: Request,
        @Param('id', ParseIntPipe) messageId: number,
    ): Promise<number>  {
        return this.favoriteService.unFavoriteByMessageId(req.user.id, messageId);
    }
}

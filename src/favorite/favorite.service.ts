import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Favorites, Message } from '@prisma/client';


@Injectable()
export class FavoriteService {
    constructor(private prisma: PrismaService) { }

    //特定の投稿のお気に入り数の取得
    async getFavoritesByMessageId(messageId: number) {
        return await this.prisma.favorites.findMany({
            where: {
                messageId: messageId,
            },
        });
    }

    //お気に入りの登録機能
    async favoriteByMessageId(
        userId: number,
        messageId: number
    ): Promise<Favorites | ForbiddenException> {
        const message = await this.prisma.message.findMany({
            where: {
                id: messageId,
            },
        });

        if (message.length === 0) {
            throw new ForbiddenException('そのメッセージは存在しません');
        }


        const nowFavoriteing = await this.prisma.favorites.findFirst({
            where: {
                userId: userId,
                messageId: messageId,
            },
        });

        if (nowFavoriteing) {
            throw new ForbiddenException('既にお気に入りに登録されています');
        }

        const favoriteMessage = await this.prisma.favorites.create({
            data: {
                userId,
                messageId,
            },
        });

        return  favoriteMessage;
    }

    //お気に入りの解除機能
    async unFavoriteByMessageId(
        userId: number,
        messageId: number
    ): Promise<number> {
        const message = await this.prisma.message.findMany({
            where: {
                id: messageId,
            },
        });

        if (message.length === 0) {
            throw new ForbiddenException('そのメッセージは存在しません');
        }

        const nowFavoriteing = await this.prisma.favorites.findFirst({
            where: {
                userId,
                messageId,
            },
        });

        if (!nowFavoriteing) {
            throw new ForbiddenException('お気に入り登録されていません');
        }
        const favoriteMessageId = nowFavoriteing.id;
        if (favoriteMessageId) {
            const favoriteMessage = await this.prisma.favorites.delete({
                where: {
                    id: favoriteMessageId,
                },
            });
            return favoriteMessageId;
        } else {
            throw new ForbiddenException('お気に入りのIdが取得できませんでした');
        }

    }
}


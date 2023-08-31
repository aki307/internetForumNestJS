import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Res,
    Req,
    Get,
    Render,
    Redirect,
    Query,
    // 仮説検証(controllerのみでsignup)
    ForbiddenException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';
// ログイン、ログアウト用のDataTransferObject
import { AuthDtoLoginLogout } from './dto/auth.dto.login.logout';
// 仮説検証(controllerのみでsignup)
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        // 仮説検証(controllerのみでsignup)
        private readonly prisma: PrismaService,
        ) {
     }

    // Postman-> Promise<Msg>
    // View -> Promise<void>
    @Post('signup')
    async signUp(@Body() dto: AuthDto, @Res() res: Response): Promise<Msg> {


        // テスト(Postmanでもエラー時はだめ)
        const hashed = await bcrypt.hash(dto.password, 12);
        try{
            await this.prisma.user.create({
                data: {
                    email:dto.email,
                    hashedPassword: hashed,
                    userName: dto.userName
                },
            });
            // Postman用
            return {
                message: 'ok',
            };
        }catch (error: any) {
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if( error.code === 'P2002') {
                    throw new ForbiddenException('このメールアドレスは既に登録されています。');
                }
            }
        }

    }

    // Postman-> Promise<Msg>
    // view-> void
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() dto: AuthDtoLoginLogout,
        @Res({ passthrough: true }) res: Response,
    ): Promise<Msg> {
            const jwt = await this.authService.login(dto);
            res.cookie('access_token', jwt.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
            });
            return {
                message: 'ok',
            };
    }


    // view時→void型, PostMan->Msg
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
        console.log('Logging out...');

        res.cookie('access_token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });

        console.log('Before redirecting...');
    

        // Postman用
        return {
            message: 'logoutok',
        };
    }

}

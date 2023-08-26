import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
// ログイン、ログアウト用
import { AuthDtoLoginLogout } from './dto/auth.dto.login.logout';
import { Msg, Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ){}
    async signUp(dto: AuthDto): Promise<Msg>{
        
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
        }catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if( error.code === 'P2002') {
                    throw new ForbiddenException('このメールアドレスは既に登録されています。');
                }
            }
            throw error;
        }
    }
    async login(dto: AuthDtoLoginLogout): Promise<Jwt>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) throw new ForbiddenException('Eメールもしくはパスワードが正しくありません。');
        const isVaild = await bcrypt.compare(dto.password, user.hashedPassword);
        if(!isVaild) throw new ForbiddenException('Eメールもしくはパスワードが正しくありません。');
        return this.generateJwt(user.id, user.email);
    }
    async generateJwt(userId: number, email: string): Promise<Jwt>{
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: secret,
        });
        return {
            accessToken: token,
        };
    }
}

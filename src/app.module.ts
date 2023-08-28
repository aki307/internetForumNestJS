import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MessageModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


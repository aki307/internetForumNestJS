import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      const httpArgumentsHost = context.switchToHttp();
      const response = httpArgumentsHost.getResponse();
      response.redirect('/'); // ログイン画面にリダイレクト
      return false; // 認証が失敗したので false を返す
    } 
      return true; // 認証が成功した場合は true を返してリクエストを続行
    
      
    
    
    
  }

   handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext
  ){
    if (err || !user) {
      const httpArgumentsHost = context.switchToHttp();
      const response = httpArgumentsHost.getResponse();
      response.redirect('/'); // ログイン画面にリダイレクト
      return
    }
    return user;
  }
}

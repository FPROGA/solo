/*import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegister } from 'dto/user.register';
import { UserLogin } from 'dto/user.login';
import express from 'express';
import { Cookies } from '../decorators/cookies.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}
  @UsePipes(new ValidationPipe())
  @Post('/register')
  registrate(
    @Body() userInfo: UserRegister,
  ): Promise<{
    message: string;
    user: { id: any; username: any; phoneNumber: any };
  }> {
    return this.appService.registerUser(userInfo);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(
    @Body() userInfo: UserLogin,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ username: any; phoneNumber }> {
    const info = await this.appService.loginUser(userInfo);
    const { session_id, user } = info;
    res.cookie('session_id', session_id, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 6 * 24 * 60 * 60 * 1000,
      signed: true,
    });
    return {
      username: user.username,
      phoneNumber: user.phoneNumber,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('/logout')
  async logout(
    @Cookies('session_id') session_id: string, // 🔥 БЕРЁМ из Body!
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.appService.logout(session_id);
    res.clearCookie('session_id');
    return { message: 'Выход успешен' };
  }

  @Get('me')
  async getMe(@Cookies('session_id') session_id: string) {
    return await this.appService.getMe(session_id);
  }
}


*/

import { Body, Controller, Post } from '@nestjs/common';
import { AuthActiveService } from './auth-active.service';

@Controller('auth')
export class AuthActiveController {
  constructor(private readonly auth: AuthActiveService) {}

  @Post('login')
  async login(@Body() body: { phoneNumber: string; password: string }) {
    const result = await this.auth.login(body.phoneNumber ?? '', body.password ?? '');
    return { ok: true, ...result };
  }
}

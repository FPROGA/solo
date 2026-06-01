import { Body, Controller, Post } from '@nestjs/common';
import { TelephoneService } from './telephone.service';

@Controller()
export class TelephoneController {
  constructor(private readonly phoneService: TelephoneService) {}
  @Post('api/phone') // 👈 Теперь путь: /api/phone
  async sendPhone(@Body() body: { phone: string }) {
    return await this.phoneService.sendPhone(body.phone);
  }
}

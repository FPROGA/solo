import { Body, Controller, Post } from '@nestjs/common';
import { AuthActiveService } from '../auth/auth-active.service';
import type { PurchaseDto } from '../auth/auth-active.service';

type PurchaseBody = PurchaseDto & { userId?: string };

@Controller('api/attestation')
export class AttestationController {
  constructor(private readonly auth: AuthActiveService) {}

  /** Новый аккаунт или докупка класса для существующего пользователя */
  @Post('purchase')
  async purchase(@Body() body: PurchaseBody) {
    if (body.userId?.trim()) {
      const result = await this.auth.addPurchasedClass(
        body.userId.trim(),
        body.attestationId,
      );
      return { ok: true, ...result };
    }
    const result = await this.auth.registerPurchase(body);
    return { ok: true, ...result };
  }
}

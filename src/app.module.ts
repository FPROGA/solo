import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelephoneService } from './telephone/telephone.service';
import { TelephoneController } from './telephone/telephone.controller';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { AuthActiveService } from './auth/auth-active.service';
import { AuthActiveController } from './auth/auth-active.controller';
import { AttestationController } from './attestation/attestation.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    TelephoneController,
    TestController,
    AuthActiveController,
    AttestationController,
  ],
  providers: [AppService, TelephoneService, TestService, AuthActiveService],
})
export class AppModule {}

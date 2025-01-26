import { Module } from '@nestjs/common';

import { ConfirmedPaymentsController } from './controllers/confirmed-payments.controller';
import { ConfirmedPaymentsService } from './services/confirmed-payments.service';

@Module({
  controllers: [ConfirmedPaymentsController],
  providers: [ConfirmedPaymentsService],
})
export class CorfirmedPaymentsModule {}

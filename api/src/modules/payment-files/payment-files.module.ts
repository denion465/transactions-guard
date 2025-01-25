import { Module } from '@nestjs/common';

import { PaymentFilesController } from './controllers/payment-files.controller';
import { PaymentFilesService } from './services/payment-files.service';

@Module({
  controllers: [PaymentFilesController],
  providers: [PaymentFilesService],
})
export class PaymentFilesModule {}

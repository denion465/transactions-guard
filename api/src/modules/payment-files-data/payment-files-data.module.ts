import { Module } from '@nestjs/common';

import { PaymentFilesDataController } from './controllers/payment-files-data.controller';
import { PaymentFilesDataService } from './services/payment-files-data.service';

@Module({
  controllers: [PaymentFilesDataController],
  providers: [PaymentFilesDataService],
})
export class PaymentFilesDataModule {}

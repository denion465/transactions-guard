import { Module } from '@nestjs/common';

import { PaymentFilesDataModule } from './modules/payment-files-data/payment-files-data.module';
import { PaymentFilesModule } from './modules/payment-files/payment-files.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [DatabaseModule, PaymentFilesModule, PaymentFilesDataModule],
})
export class AppModule {}

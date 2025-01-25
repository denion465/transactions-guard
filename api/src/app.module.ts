import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { PaymentFilesModule } from './modules/payment-files/payment-files.module';

@Module({
  imports: [DatabaseModule, PaymentFilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

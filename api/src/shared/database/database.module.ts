import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { PaymentFilesDataRepository } from './repositories/payment-files-data.repository';
import { PaymentFilesRepository } from './repositories/payment-files.repository';
import { TransactionContext } from './transaction.context';

@Global()
@Module({
  providers: [
    PrismaService,
    PaymentFilesRepository,
    PaymentFilesDataRepository,
    TransactionContext,
  ],
  exports: [
    PrismaService,
    PaymentFilesRepository,
    PaymentFilesDataRepository,
    TransactionContext,
  ],
})
export class DatabaseModule {}

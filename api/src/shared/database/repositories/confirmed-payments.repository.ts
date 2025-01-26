import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { TransactionContext } from '../transaction.context';

@Injectable()
export class ConfirmedPaymentsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionContext: TransactionContext,
  ) {}

  async createMany(createManyDto: Prisma.ConfirmedPaymentCreateManyArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.confirmedPayment.createMany(createManyDto);
  }
}

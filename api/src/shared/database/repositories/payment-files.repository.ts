import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { TransactionContext } from '../transaction.context';

@Injectable()
export class PaymentFilesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionContext: TransactionContext,
  ) {}

  async create(createDto: Prisma.PaymentFileCreateArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.paymentFile.create(createDto);
  }

  async findUnique(findUniqueDto: Prisma.PaymentFileFindUniqueArgs) {
    return await this.prismaService.paymentFile.findUnique(findUniqueDto);
  }

  async findMany(findManyDto: Prisma.PaymentFileFindManyArgs) {
    return await this.prismaService.paymentFile.findMany(findManyDto);
  }

  async update(updateDto: Prisma.PaymentFileUpdateArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.paymentFile.update(updateDto);
  }
}

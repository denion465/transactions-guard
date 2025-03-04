import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { TransactionContext } from '../transaction.context';

@Injectable()
export class PaymentFilesDataRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionContext: TransactionContext,
  ) {}

  async createMany(createManyDto: Prisma.PaymentFileDataCreateManyArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.paymentFileData.createMany(createManyDto);
  }

  async findUnique(findUniqueDto: Prisma.PaymentFileDataFindUniqueArgs) {
    return await this.prismaService.paymentFileData.findUnique(findUniqueDto);
  }

  async findMany(findManyDto: Prisma.PaymentFileDataFindManyArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.paymentFileData.findMany(findManyDto);
  }

  async update(updateDto: Prisma.PaymentFileDataUpdateArgs) {
    return await this.prismaService.paymentFileData.update(updateDto);
  }

  async updateMany(updateManyDto: Prisma.PaymentFileDataUpdateManyArgs) {
    const prisma = this.transactionContext.get() ?? this.prismaService;
    return await prisma.paymentFileData.updateMany(updateManyDto);
  }

  async delete(deleteDto: Prisma.PaymentFileDataDeleteArgs) {
    return await this.prismaService.paymentFileData.delete(deleteDto);
  }

  async count(countDto: Prisma.PaymentFileDataCountArgs) {
    return await this.prismaService.paymentFileData.count(countDto);
  }
}

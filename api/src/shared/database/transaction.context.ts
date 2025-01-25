import { Injectable, Scope } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type PrismaClientType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable({ scope: Scope.REQUEST })
export class TransactionContext {
  private prisma: PrismaClientType;

  set(prisma: PrismaClientType) {
    this.prisma = prisma;
  }

  get() {
    return this.prisma;
  }
}

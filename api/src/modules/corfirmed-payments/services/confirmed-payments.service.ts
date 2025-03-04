import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Readable, Transform } from 'node:stream';
import * as moment from 'moment';

import { ConfirmedPaymentsRepository } from '@/shared/database/repositories/confirmed-payments.repository';
import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesRepository } from '@/shared/database/repositories/payment-files.repository';
import { TransactionContext } from '@/shared/database/transaction.context';
import { PaymentStatusEnum } from '@/shared/enums/payment-status-enum';
import { IBatchItem } from '../interfaces/batch-item.interface';
import { ICSVFields } from '../interfaces/csv-fields.interface';
import { ConfirmedPaymentsResponseDto } from '../dtos/response/confirmed-payments-response.dto';

@Injectable()
export class ConfirmedPaymentsService {
  constructor(
    private readonly paymentFilesRepo: PaymentFilesRepository,
    private readonly paymentFilesDataRepo: PaymentFilesDataRepository,
    private readonly prismaService: PrismaService,
    private readonly confirmedPaymentsRepo: ConfirmedPaymentsRepository,
    private readonly transactionContext: TransactionContext,
  ) {}

  async corfimPayments(fileId: string): Promise<ConfirmedPaymentsResponseDto> {
    await this.prismaService.$transaction(
      async (prisma) => {
        this.transactionContext.set(prisma);

        const paymentFile = await this.paymentFilesRepo.findUnique({
          where: {
            id: fileId,
            status: PaymentStatusEnum.PENDING,
          },
          select: {
            id: true,
            fileName: true,
          },
        });

        if (!paymentFile) {
          throw new NotFoundException(
            `File with id ${fileId} not found or already confirmed`,
          );
        }

        let cursor: string | undefined;
        let batchItems: IBatchItem[] = [];
        const batchlength = 5000;

        do {
          batchItems = await this.paymentFilesDataRepo.findMany({
            where: {
              paymentFileId: paymentFile.id,
              id: { gt: cursor },
              status: PaymentStatusEnum.PENDING,
            },
            select: {
              id: true,
              name: true,
              age: true,
              address: true,
              document: true,
              paidAmount: true,
              birthDate: true,
            },
            take: batchlength,
            orderBy: { id: 'asc' },
          });

          await Promise.all([
            this.confirmedPaymentsRepo.createMany({
              data: batchItems.map((item) => ({
                name: item.name,
                age: item.age,
                address: item.address,
                document: item.document,
                paidAmount: item.paidAmount,
                birthDate: item.birthDate,
                paymentFileId: paymentFile.id,
              })),
            }),
            this.paymentFilesDataRepo.updateMany({
              where: {
                id: { in: batchItems.map((item) => item.id) },
              },
              data: {
                status: PaymentStatusEnum.CONFIRMED,
              },
            }),
          ]);

          if (batchItems.length > 0) {
            const lastItem = batchItems[batchItems.length - 1];
            cursor = lastItem.id;
          }
        } while (batchItems.length > 0);

        await this.paymentFilesRepo.update({
          where: {
            id: paymentFile.id,
          },
          data: {
            status: PaymentStatusEnum.CONFIRMED,
          },
        });
      },
      {
        timeout: 30000,
      },
    );

    return {
      message: 'Payment data successfully confirmed',
      code: 200,
    };
  }

  getConfirmedPaymentsCsv() {
    let counter = 0;
    const batchItemsReadable = Readable.from(this.getPaymentItems());
    const mapField = new Transform({
      objectMode: true,
      transform(chunk: ICSVFields, _enconding, cb) {
        const { name, address, age, document, paidAmount, birthDate } = chunk;
        const result = `${name},${age},${address},${document},${paidAmount},${moment(birthDate).format('YYYY-MM-DD')}\n`;
        cb(null, result);
      },
    });
    const mapHeaders = new Transform({
      transform(chunk: string, _enconding, cb) {
        if (counter) {
          return cb(null, chunk);
        }

        counter++;
        cb(
          null,
          'Nome,Idade,Endereço,CPF,Quantia Paga,Data de Nascimento\n'.concat(
            chunk,
          ),
        );
      },
    });

    return batchItemsReadable.pipe(mapField).pipe(mapHeaders);
  }

  private async *getPaymentItems() {
    let cursor: string | undefined;
    let batchItems: IBatchItem[] = [];
    const batchlength = 5000;

    do {
      batchItems = await this.confirmedPaymentsRepo.findMany({
        where: {
          id: { gt: cursor },
        },
        select: {
          id: true,
          name: true,
          age: true,
          address: true,
          document: true,
          paidAmount: true,
          birthDate: true,
        },
        take: batchlength,
        orderBy: { id: 'asc' },
      });

      if (Array.isArray(batchItems) && batchItems.length > 0) {
        const lastItem = batchItems[batchItems.length - 1];
        cursor = lastItem.id;

        for (const item of batchItems) {
          yield item;
        }
      }
    } while (Array.isArray(batchItems) && batchItems.length > 0);
  }
}

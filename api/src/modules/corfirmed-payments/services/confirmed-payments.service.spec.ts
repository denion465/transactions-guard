import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/shared/database/prisma.service';
import { ConfirmedPaymentsRepository } from '@/shared/database/repositories/confirmed-payments.repository';
import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesRepository } from '@/shared/database/repositories/payment-files.repository';
import { TransactionContext } from '@/shared/database/transaction.context';
import { PaymentStatusEnum } from '@/shared/enums/payment-status-enum';
import { ConfirmedPaymentsService } from './confirmed-payments.service';

describe('#ComfirmedPaymentsService Test Suite', () => {
  let service: ConfirmedPaymentsService;
  let prismaService: PrismaService;
  const mockPrisma = {
    paymentFiles: {
      findUnique: (jest.fn() as jest.Mock<any>).mockResolvedValue({
        id: '123',
        fileName: 'file-name',
      }),
      update: jest.fn(),
    },
    paymentFilesData: {
      findMany: jest.fn() as jest.Mock<any>,
      updateMany: jest.fn(),
    },
    confirmedPayments: {
      createMany: jest.fn(),
      findMany: jest.fn() as jest.Mock<any>,
    },
  };
  const mockTransactionContext = {
    set: jest.fn(),
    get: jest.fn().mockReturnValue(mockPrisma),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmedPaymentsService,
        {
          provide: PaymentFilesRepository,
          useValue: {
            findUnique: mockPrisma.paymentFiles.findUnique,
            update: mockPrisma.paymentFiles.update,
          },
        },
        {
          provide: PaymentFilesDataRepository,
          useValue: {
            findMany: mockPrisma.paymentFilesData.findMany,
            updateMany: mockPrisma.paymentFilesData.updateMany,
          },
        },
        {
          provide: ConfirmedPaymentsRepository,
          useValue: {
            createMany: mockPrisma.confirmedPayments.createMany,
            findMany: mockPrisma.confirmedPayments.findMany,
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest
              .fn()
              .mockImplementation(
                async (callback: (prisma: PrismaService) => Promise<void>) => {
                  await callback(prismaService);
                },
              ),
          },
        },
        {
          provide: TransactionContext,
          useValue: mockTransactionContext,
        },
      ],
    }).compile();

    service = module.get<ConfirmedPaymentsService>(ConfirmedPaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('#corfimPayments', () => {
    it('should process all batches and confirm payments', async () => {
      const fileId = '123';
      const paymentFile = {
        id: fileId,
        fileName: 'file-name',
      };

      const batchItems = [
        {
          id: '1',
          name: 'John Doe',
          age: 30,
          address: '123 Main St',
          document: '123456789',
          paidAmount: 100,
          birthDate: '1990-01-01',
        },
        {
          id: '2',
          name: 'Jane Doe',
          age: 25,
          address: '456 Elm St',
          document: '987654321',
          paidAmount: 200,
          birthDate: '1995-01-01',
        },
      ];

      mockPrisma.paymentFilesData.findMany
        .mockResolvedValueOnce(batchItems)
        .mockResolvedValueOnce([]);

      const result = await service.corfimPayments(fileId);

      expect(mockPrisma.paymentFilesData.findMany).toHaveBeenCalledTimes(2);
      expect(mockPrisma.confirmedPayments.createMany).toHaveBeenCalledWith({
        data: batchItems.map((item) => ({
          name: item.name,
          age: item.age,
          address: item.address,
          document: item.document,
          paidAmount: item.paidAmount,
          birthDate: item.birthDate,
          paymentFileId: paymentFile.id,
        })),
      });
      expect(mockPrisma.paymentFilesData.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: batchItems.map((item) => item.id) },
        },
        data: {
          status: PaymentStatusEnum.CONFIRMED,
        },
      });
      expect(result).toStrictEqual({
        message: 'Payment data successfully confirmed',
        code: 200,
      });
      expect(mockPrisma.paymentFiles.update).toHaveBeenCalledWith({
        where: {
          id: fileId,
        },
        data: {
          status: PaymentStatusEnum.CONFIRMED,
        },
      });
      expect(mockPrisma.paymentFilesData.findMany).toHaveBeenCalledTimes(2);
      expect(mockPrisma.paymentFilesData.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: batchItems.map((item) => item.id) },
        },
        data: {
          status: PaymentStatusEnum.CONFIRMED,
        },
      });
    });

    it('should throw NotFoundException if file not found or already confirmed', async () => {
      const fileId = 'non-existent-file-id';

      mockPrisma.paymentFiles.findUnique.mockResolvedValue(null);

      await expect(service.corfimPayments(fileId)).rejects.toThrowError(
        new NotFoundException(
          `File with id ${fileId} not found or already confirmed`,
        ),
      );

      expect(mockPrisma.paymentFiles.findUnique).toHaveBeenCalledWith({
        where: {
          id: fileId,
          status: PaymentStatusEnum.PENDING,
        },
        select: {
          id: true,
          fileName: true,
        },
      });
      expect(mockPrisma.paymentFilesData.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.confirmedPayments.createMany).not.toHaveBeenCalled();
      expect(mockPrisma.paymentFilesData.updateMany).not.toHaveBeenCalled();
      expect(mockPrisma.paymentFiles.update).not.toHaveBeenCalled();
    });
  });

  describe('getConfirmedPaymentsCsv', () => {
    it('should return a CSV stream with headers and data', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'John Doe',
          age: 30,
          address: '123 Main St',
          document: '123456789',
          paidAmount: 1000,
          birthDate: '1990-01-01',
        },
        {
          id: '2',
          name: 'Jane Doe',
          age: 25,
          address: '456 Elm St',
          document: '987654321',
          paidAmount: 2000,
          birthDate: '1995-01-01',
        },
      ];

      mockPrisma.confirmedPayments.findMany
        .mockResolvedValueOnce(mockItems)
        .mockResolvedValueOnce([]);

      const csvStream = service.getConfirmedPaymentsCsv();

      const chunks: string[] = [];
      for await (const chunk of csvStream) {
        chunks.push(chunk as string);
      }

      const csvOutput = chunks.join('');

      const expectedOutput =
        'Nome,Idade,Endereço,CPF,Quantia Paga,Data de Nascimento\n' +
        'John Doe,30,123 Main St,123456789,1000,1990-01-01\n' +
        'Jane Doe,25,456 Elm St,987654321,2000,1995-01-01\n';

      expect(csvOutput).toStrictEqual(expectedOutput);
      expect(mockPrisma.confirmedPayments.findMany).toHaveBeenCalledWith({
        where: { id: { gt: undefined } },
        select: {
          id: true,
          name: true,
          age: true,
          address: true,
          document: true,
          paidAmount: true,
          birthDate: true,
        },
        take: 5000,
        orderBy: { id: 'asc' },
      });
      expect(mockPrisma.confirmedPayments.findMany).toHaveBeenCalledTimes(2);
    });
  });
});

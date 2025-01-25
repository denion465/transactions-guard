import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as chardet from 'chardet';
import * as moment from 'moment';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';

import { PrismaService } from '@/shared/database/prisma.service';
import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesRepository } from '@/shared/database/repositories/payment-files.repository';
import { TransactionContext } from '@/shared/database/transaction.context';
import { isValidTextFile } from '@/shared/utils/is-valid-text-file';
import { IFile } from '../interfaces/file.interface';
import { PaymentFilesService } from './payment-files.service';

jest.mock('chardet');
jest.mock('iconv-lite');
jest.mock('node:fs');
jest.mock('node:readline/promises');
jest.mock('@/shared/utils/is-valid-text-file');

function createFileMock(overrides?: Partial<IFile>) {
  return {
    buffer: Buffer.from('abcd'),
    originalname: 'test.rem',
    fieldname: 'test',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    size: 0,
    destination: '/tmp',
    filename: 'test',
    path: '/tmp',
    ...overrides,
  };
}

describe('#PaymentFilesService Test Suite', () => {
  let service: PaymentFilesService;
  let paymentFilesRepo: PaymentFilesRepository;
  let prismaService: PrismaService;
  const mockPaymentFilesRepo = { create: jest.fn() };
  const mockPaymentFilesDataRepo = { createMany: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFilesService,
        {
          provide: PaymentFilesRepository,
          useValue: mockPaymentFilesRepo,
        },
        {
          provide: PaymentFilesDataRepository,
          useValue: mockPaymentFilesDataRepo,
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
        {
          provide: TransactionContext,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentFilesService>(PaymentFilesService);
    paymentFilesRepo = module.get<PaymentFilesRepository>(
      PaymentFilesRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('saveFileData', () => {
    it('should throw BadRequestException if file content is invalid', async () => {
      const invalidBufferBytes = [0xff, 0xfe, 0x00, 0xd8];
      const mockFile = createFileMock({
        buffer: Buffer.from(invalidBufferBytes),
      });

      (chardet.detectFile as jest.Mock<any>).mockResolvedValue(undefined);

      (createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
      });

      (createInterface as jest.Mock).mockReturnValue({
        [Symbol.asyncIterator]: () => {
          const lines = invalidBufferBytes;
          return {
            next: () => ({
              value: lines.shift(),
              done: lines.length === 0,
            }),
          };
        },
        close: jest.fn(),
      });

      (isValidTextFile as jest.Mock).mockReturnValue(false);

      await expect(service.saveFileData(mockFile)).rejects.toThrowError(
        new BadRequestException(
          'Invalid file content, only text files are allowed',
        ),
      );
    });

    it('should save file data successfully', async () => {
      const mockLine1 =
        'Kathryne Lockma0051      845 Fahey Summit East Dillon11626761422000000000007638220230321';
      const mockLine2 =
        '     Frank Cole0025    57648 Claudine Key Lockmanbury32641348391000000000003172920230830';

      const mockFile = createFileMock({
        buffer: Buffer.from(`${mockLine1}\n${mockLine2}`, 'utf-16le'),
      });

      const mockItem1 = {
        name: 'Kathryne Lockma',
        age: 51,
        address: '845 Fahey Summit East Dillon',
        document: '11626761422',
        paidAmount: 76382,
        birthDate: moment.utc('2023-03-21').toISOString(),
      };
      const mockItem2 = {
        name: 'Frank Cole',
        age: 25,
        address: '57648 Claudine Key Lockmanbury',
        document: '32641348391',
        paidAmount: 31729,
        birthDate: moment.utc('2023-08-30').toISOString(),
      };

      (chardet.detectFile as jest.Mock<any>).mockResolvedValue('utf-16le');

      (createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
      });

      (createInterface as jest.Mock).mockReturnValue({
        [Symbol.asyncIterator]: () => {
          const lines = [mockLine1, mockLine2];
          return {
            next: () => {
              if (lines.length === 0) {
                return { value: null, done: true };
              }
              return { value: lines.shift(), done: false };
            },
          };
        },
        close: jest.fn(),
      });

      (isValidTextFile as jest.Mock).mockReturnValue(true);

      (paymentFilesRepo.create as jest.Mock<any>).mockResolvedValue({
        id: '123',
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback: (prisma: PrismaService) => Promise<void>) => {
          await callback(prismaService);
        },
      );

      const result = await service.saveFileData(mockFile);

      expect(result).toEqual({
        id: '123',
        message: 'File data saved successfully',
        code: 201,
      });

      expect(mockPaymentFilesRepo.create).toHaveBeenCalledWith({
        data: {
          fileName: 'test.rem',
          status: 'PENDING',
        },
      });

      expect(mockPaymentFilesDataRepo.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            ...mockItem1,
            paymentFileId: '123',
            status: 'PENDING',
          }),
          expect.objectContaining({
            ...mockItem2,
            paymentFileId: '123',
            status: 'PENDING',
          }),
        ],
      });
    });

    it('should save file data successfully with batch processing', async () => {
      const mockLines: string[] = Array.from(
        { length: 10050 },
        () =>
          `Kathryne Lockma0051      845 Fahey Summit East Dillon11626761422000000000007638220230321`,
      );
      const mockFile = createFileMock({
        buffer: Buffer.from(mockLines.join('\n'), 'utf-16le'),
      });

      const mockItem = {
        name: 'Kathryne Lockma',
        age: 51,
        address: '845 Fahey Summit East Dillon',
        document: '11626761422',
        paidAmount: 76382,
        birthDate: moment.utc('2023-03-21').toISOString(),
      };

      (chardet.detectFile as jest.Mock<any>).mockResolvedValue('utf-16le');

      (createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
      });

      (createInterface as jest.Mock).mockReturnValue({
        [Symbol.asyncIterator]: () => {
          const lines = [...mockLines];
          return {
            next: () => {
              if (lines.length === 0) {
                return { value: null, done: true };
              }
              return { value: lines.shift(), done: false };
            },
          };
        },
        close: jest.fn(),
      });

      (isValidTextFile as jest.Mock).mockReturnValue(true);

      (paymentFilesRepo.create as jest.Mock<any>).mockResolvedValue({
        id: '123',
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback: (prisma: PrismaService) => Promise<void>) => {
          await callback(prismaService);
        },
      );

      const result = await service.saveFileData(mockFile);

      expect(result).toEqual({
        id: '123',
        message: 'File data saved successfully',
        code: 201,
      });
      expect(mockPaymentFilesRepo.create).toHaveBeenCalledWith({
        data: {
          fileName: 'test.rem',
          status: 'PENDING',
        },
      });
      expect(mockPaymentFilesDataRepo.createMany).toHaveBeenCalledTimes(2);
      expect(mockPaymentFilesDataRepo.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            ...mockItem,
            paymentFileId: '123',
            status: 'PENDING',
          }),
        ]),
      });
    });
  });

  describe('parseItemToDB', () => {
    it('should parse a valid line correctly', () => {
      const line =
        'Kathryne Lockma0051      845 Fahey Summit East Dillon11626761422000000000007638220230321';
      const result = service['parseItemToDB'](line);

      expect(result).toStrictEqual({
        name: 'Kathryne Lockma',
        age: 51,
        address: '845 Fahey Summit East Dillon',
        document: '11626761422',
        paidAmount: 76382,
        birthDate: moment.utc('20230321', 'YYYYMMDD').toISOString(),
      });
    });
  });
});

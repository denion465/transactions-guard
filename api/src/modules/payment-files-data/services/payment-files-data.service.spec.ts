import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';

import { PrismaService } from '@/shared/database/prisma.service';
import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { TransactionContext } from '@/shared/database/transaction.context';
import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { PaymentFilesDataService } from './payment-files-data.service';

jest.mock('chardet');
jest.mock('iconv-lite');
jest.mock('node:fs');
jest.mock('node:readline/promises');
jest.mock('@/shared/utils/is-valid-text-file');

describe('#PaymentFilesDataService Test Suite', () => {
  let service: PaymentFilesDataService;
  const mockPaymentFilesRepo = { create: jest.fn() };
  const mockPaymentFilesDataRepo = {
    createMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockPaymentFileDataDto: PaymentFilesDataDto = {
    name: 'Batata Cenoura',
    age: 20,
    address: 'Rua Vida',
    document: '12345678910',
    paidAmount: 2000,
    birthDate: '1990-10-10',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFilesDataService,
        {
          provide: PaymentFilesDataRepository,
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

    service = module.get<PaymentFilesDataService>(PaymentFilesDataService);
  });

  describe('#update', () => {
    it('should thrown BadRequestException if the file data not found', async () => {
      const mockId = '123';
      (mockPaymentFilesDataRepo.findUnique as jest.Mock<any>).mockResolvedValue(
        { id: null },
      );

      await expect(
        service.update(mockId, mockPaymentFileDataDto),
      ).rejects.toThrowError(
        new BadRequestException(`File data with ${mockId} not found`),
      );
      expect(mockPaymentFilesDataRepo.update).not.toHaveBeenCalled();
      expect(mockPaymentFilesDataRepo.findUnique).toHaveBeenCalledWith({
        where: { id: mockId },
        select: { id: true },
      });
    });
    it('should be update file data successfully', async () => {
      const mockId = '123';
      (mockPaymentFilesDataRepo.findUnique as jest.Mock<any>).mockResolvedValue(
        { id: mockId },
      );

      (mockPaymentFilesDataRepo.update as jest.Mock<any>).mockResolvedValue({
        id: mockId,
      });

      const result = await service.update(mockId, mockPaymentFileDataDto);

      expect(mockPaymentFilesDataRepo.update).toHaveBeenCalledWith({
        where: { id: mockId },
        select: { id: true },
        data: {
          ...mockPaymentFileDataDto,
          birthDate: moment(mockPaymentFileDataDto.birthDate).toDate(),
        },
      });
      expect(result).toStrictEqual({
        id: mockId,
        message: 'File data updated successfully',
        code: 200,
      });
    });
  });

  describe('#remove', () => {
    it('should thrown BadRequestException if the file data not found', async () => {
      const mockId = '123';
      (mockPaymentFilesDataRepo.findUnique as jest.Mock<any>).mockResolvedValue(
        { id: null },
      );

      await expect(service.remove(mockId)).rejects.toThrowError(
        new BadRequestException(`File data with ${mockId} not found`),
      );
      expect(mockPaymentFilesDataRepo.delete).not.toHaveBeenCalled();
      expect(mockPaymentFilesDataRepo.findUnique).toHaveBeenCalledWith({
        where: { id: mockId },
        select: { id: true },
      });
    });
    it('should be delete file data successfully', async () => {
      const mockId = '123';
      (mockPaymentFilesDataRepo.findUnique as jest.Mock<any>).mockResolvedValue(
        { id: mockId },
      );

      (mockPaymentFilesDataRepo.delete as jest.Mock<any>).mockResolvedValue(
        undefined,
      );

      await service.remove(mockId);

      expect(mockPaymentFilesDataRepo.delete).toHaveBeenCalledWith({
        where: { id: mockId },
      });
    });
  });
});

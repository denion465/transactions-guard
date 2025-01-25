import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { PaymentFilesDataService } from '../services/payment-files-data.service';
import { PaymentFilesDataController } from './payment-files-data.controller';

async function validateDto<T extends object>(
  dto: any,
  DtoClass: new () => T,
): Promise<void> {
  const dtoInstance = plainToInstance(DtoClass, dto);
  const errors: ValidationError[] = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
}

describe('#PaymentFilesDataController Test Suite', () => {
  let controller: PaymentFilesDataController;
  let service: PaymentFilesDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentFilesDataController],
      providers: [
        {
          provide: PaymentFilesDataService,
          useValue: {
            saveFileData: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentFilesDataController>(
      PaymentFilesDataController,
    );
    service = module.get<PaymentFilesDataService>(PaymentFilesDataService);
  });

  describe('#update', () => {
    it('should call updateFile with the correct paramters', async () => {
      const mockPaymentFileDataDto: PaymentFilesDataDto = {
        name: 'Batata Cenoura',
        age: 20,
        address: 'Rua Vida',
        document: '12345678910',
        paidAmount: 2000,
        birthDate: '1990-10-10',
      };

      const updateSpy = jest.spyOn(service, 'update').mockResolvedValue({
        id: '123',
        code: 200,
        message: 'File data updated successfully',
      });

      const result = await controller.update('123', mockPaymentFileDataDto);

      const expected = {
        id: '123',
        code: 200,
        message: 'File data updated successfully',
      };

      expect(updateSpy).toHaveBeenCalledWith('123', mockPaymentFileDataDto);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });

    it('should throw BadRequestException if paymentFileData body is invalid', async () => {
      const mockPaymentFileDataDto = {
        name: 'Batata Cenoura',
        age: '20',
        address: 'Rua Vida',
        document: '',
        paidAmount: '2000',
        birthDate: 19901010,
      };

      const updateSpy = jest.spyOn(service, 'update');

      await expect(
        validateDto(mockPaymentFileDataDto, PaymentFilesDataDto),
      ).rejects.toThrow(BadRequestException);
      expect(updateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('#removeFileData', () => {
    it('should call deleteFile with the correct paramters', async () => {
      const deleteFileSpy = jest.spyOn(service, 'remove');

      await controller.removeFileData('123');

      expect(deleteFileSpy).toHaveBeenCalledWith('123');
      expect(deleteFileSpy).toHaveBeenCalledTimes(1);
    });
  });
});

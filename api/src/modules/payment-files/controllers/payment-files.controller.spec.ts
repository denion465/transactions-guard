import { it, describe, jest, beforeEach, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { PaymentFilesController } from './payment-files.controller';
import { PaymentFilesService } from '../services/payment-files.service';
import { IFile } from '../interfaces/file.interface';
import { FileRequiredPipe } from '../pipes/file-required.pipe';

describe('#PaymentFilesController Test Suite', () => {
  let controller: PaymentFilesController;
  let service: PaymentFilesService;
  let pipe: FileRequiredPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentFilesController],
      providers: [
        {
          provide: PaymentFilesService,
          useValue: {
            saveFileData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentFilesController>(PaymentFilesController);
    service = module.get<PaymentFilesService>(PaymentFilesService);
    pipe = module.get<FileRequiredPipe>(FileRequiredPipe);
  });

  describe('#uploadFile', () => {
    it('should call saveUploadedFile with the correct paramters', async () => {
      const file: IFile = {
        buffer: Buffer.from('abcd'),
        originalname: 'test.rem',
        fieldname: 'test',
        encoding: '7bit',
        mimetype: 'application/octet-stream',
        size: 0,
        destination: '/tmp',
        filename: 'test',
        path: '/tmp',
      };

      const saveUploadedFileSpy = jest
        .spyOn(service, 'saveFileData')
        .mockResolvedValue({
          id: '123',
          code: 201,
          message: 'File data saved successfully',
        });

      const result = await controller.uploadFile(file);
      const expected = {
        id: '123',
        code: 201,
        message: 'File data saved successfully',
      };

      expect(saveUploadedFileSpy).toHaveBeenCalledWith(file);
      expect(saveUploadedFileSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException if the file does not send', () => {
      expect(() => pipe.transform()).toThrowError(
        new BadRequestException('File is required'),
      );
    });
  });
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';

import { IFile } from '../interfaces/file.interface';
import { FileRequiredPipe } from '../pipes/file-required.pipe';
import { PaymentFilesService } from '../services/payment-files.service';
import { PaymentFilesController } from './payment-files.controller';

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
            getAllFiles: jest.fn(),
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

  describe('#getAllFiles', () => {
    it('should call getAllFiles with the correct paramters', async () => {
      const page = 1;
      const pageSize = 10;
      const startDate = String(moment('2025-01-01').valueOf());
      const endDate = String(moment('2025-01-31').valueOf());

      const getAllFilesSpy = jest
        .spyOn(service, 'getAllFiles')
        .mockResolvedValue({
          results: [],
          page,
          pageSize,
          total: 0,
        });

      await controller.findAllFiles(page, pageSize, startDate, endDate);

      expect(getAllFilesSpy).toHaveBeenCalledWith({
        page,
        pageSize,
        startDate,
        endDate,
      });
      expect(getAllFilesSpy).toHaveBeenCalledTimes(1);
    });
  });
});

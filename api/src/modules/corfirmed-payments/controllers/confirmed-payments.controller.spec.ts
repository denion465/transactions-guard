import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { ConfirmedPaymentsController } from './confirmed-payments.controller';
import { ConfirmedPaymentsService } from '../services/confirmed-payments.service';

describe('#ComfirmedPaymentsController Test Suite', () => {
  let controller: ConfirmedPaymentsController;
  let service: ConfirmedPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmedPaymentsController],
      providers: [
        {
          provide: ConfirmedPaymentsService,
          useValue: {
            corfimPayments: jest.fn(),
            getConfirmedPaymentsCsv: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConfirmedPaymentsController>(
      ConfirmedPaymentsController,
    );
    service = module.get<ConfirmedPaymentsService>(ConfirmedPaymentsService);
  });

  describe('#confirmPayments', () => {
    it('should call corfimPayments with correct parameters', async () => {
      const fileId = '123';
      const corfimPaymentsSpy = jest.spyOn(service, 'corfimPayments');
      await controller.confirmPayments(fileId);

      expect(corfimPaymentsSpy).toHaveBeenCalledWith('123');
      expect(corfimPaymentsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#exportCSV', () => {
    it('should export CSV and set headers correctly', () => {
      const mockCsvStream = {
        pipe: jest.fn(),
      };
      const headers = {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="payments.csv"',
      };
      const mockResponse = {
        setHeader: jest.fn((key: string, value: string) => {
          headers[key] = value;
          return mockResponse;
        }),
        getHeaders: jest.fn(() => headers),
      } as unknown as Response;

      (
        jest.spyOn(service, 'getConfirmedPaymentsCsv') as jest.Mock
      ).mockReturnValue(mockCsvStream);

      controller.exportCSV(mockResponse);

      const getConfirmedPaymentsCsvSpy = jest.spyOn(
        service,
        'getConfirmedPaymentsCsv',
      );

      expect(getConfirmedPaymentsCsvSpy).toHaveBeenCalled();
      expect(mockCsvStream.pipe).toHaveBeenCalledWith(mockResponse);
      expect(mockResponse.getHeaders()).toStrictEqual({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="payments.csv"',
      });
    });
  });
});

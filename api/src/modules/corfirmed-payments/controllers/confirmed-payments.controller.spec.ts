import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

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
});

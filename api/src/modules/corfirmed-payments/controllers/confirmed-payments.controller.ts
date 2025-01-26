import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { ConfirmedPaymentsService } from '../services/confirmed-payments.service';

@Controller('transactions-guard')
export class ConfirmedPaymentsController {
  constructor(
    private readonly confirmedPaymentsService: ConfirmedPaymentsService,
  ) {}

  @Post('confirm-payments/:fileId')
  confirmPayments(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return this.confirmedPaymentsService.corfimPayments(fileId);
  }
}

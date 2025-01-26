import {
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { ConfirmedPaymentsService } from '../services/confirmed-payments.service';

@Controller('transactions-guard')
export class ConfirmedPaymentsController {
  constructor(
    private readonly confirmedPaymentsService: ConfirmedPaymentsService,
  ) {}

  @Post('confirmed-payments/:fileId')
  confirmPayments(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return this.confirmedPaymentsService.corfimPayments(fileId);
  }

  @Get('confirmed-payments/export-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="payments.csv"')
  exportCSV(@Res() res: Response) {
    const csvStream = this.confirmedPaymentsService.getConfirmedPaymentsCsv();
    csvStream.pipe(res);
  }
}

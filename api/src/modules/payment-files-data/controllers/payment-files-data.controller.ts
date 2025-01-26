import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { OptionalParseQueryDatePipe } from '@/shared/pipes/parse-status-payment-enum.pipe';
import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { PaymentFilesDataService } from '../services/payment-files-data.service';

@Controller('transactions-guard/files-data')
export class PaymentFilesDataController {
  constructor(
    private readonly paymentFilesDataService: PaymentFilesDataService,
  ) {}

  @Get(':fileId')
  async findAllFileData(
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('startDate', OptionalParseQueryDatePipe) startDate: string,
    @Query('endDate', OptionalParseQueryDatePipe) endDate: string,
  ) {
    return this.paymentFilesDataService.getAllFileData({
      fileId,
      page,
      pageSize,
      startDate,
      endDate,
    });
  }

  @Patch(':fileDataId')
  update(
    @Param('fileDataId', ParseUUIDPipe) fileDataId: string,
    @Body() updateFileDataDto: PaymentFilesDataDto,
  ) {
    return this.paymentFilesDataService.update(fileDataId, updateFileDataDto);
  }

  @Delete(':fileDataId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFileData(@Param('fileDataId', ParseUUIDPipe) fileDataId: string) {
    return this.paymentFilesDataService.remove(fileDataId);
  }
}

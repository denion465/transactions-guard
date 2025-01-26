import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OptionalParseQueryDatePipe } from '@/shared/pipes/parse-status-payment-enum.pipe';
import { IFile } from '../interfaces/file.interface';
import { FileRequiredPipe } from '../pipes/file-required.pipe';
import { PaymentFilesService } from '../services/payment-files.service';

@Controller('transactions-guard/files')
export class PaymentFilesController {
  constructor(private readonly paymentFilesService: PaymentFilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp' }))
  @UsePipes(FileRequiredPipe)
  uploadFile(@UploadedFile() file: IFile) {
    return this.paymentFilesService.saveFileData(file);
  }

  @Get()
  async findAllFiles(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('startDate', OptionalParseQueryDatePipe) startDate: string,
    @Query('endDate', OptionalParseQueryDatePipe) endDate: string,
  ) {
    return this.paymentFilesService.getAllFiles({
      page,
      pageSize,
      startDate,
      endDate,
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';

import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { PaymentFilesDataService } from '../services/payment-files-data.service';

@Controller('transactions-guard/files-data')
export class PaymentFilesDataController {
  constructor(
    private readonly paymentFilesDataService: PaymentFilesDataService,
  ) {}

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

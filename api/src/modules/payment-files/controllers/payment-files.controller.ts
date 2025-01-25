import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { IFile } from '../interfaces/file.interface';
import { PaymentFilesService } from '../services/payment-files.service';
import { FileRequiredPipe } from '../pipes/file-required.pipe';

@Controller('transactions-guard/files')
export class PaymentFilesController {
  constructor(private readonly paymentFilesService: PaymentFilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp' }))
  @UsePipes(FileRequiredPipe)
  uploadFile(@UploadedFile() file: IFile) {
    return this.paymentFilesService.saveFileData(file);
  }
}

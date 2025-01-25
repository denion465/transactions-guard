import { Injectable, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';

import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';

@Injectable()
export class PaymentFilesDataService {
  constructor(
    private readonly paymentFilesDataRepo: PaymentFilesDataRepository,
  ) {}

  async update(fileDataId: string, updateFileDataDto: PaymentFilesDataDto) {
    const fileData = await this.paymentFilesDataRepo.findUnique({
      where: {
        id: fileDataId,
      },
      select: {
        id: true,
      },
    });

    if (!fileData?.id) {
      throw new NotFoundException(`File data with ${fileDataId} not found`);
    }

    const { id } = await this.paymentFilesDataRepo.update({
      where: {
        id: fileDataId,
      },
      data: {
        ...updateFileDataDto,
        birthDate: moment(updateFileDataDto.birthDate).toDate(),
      },
      select: {
        id: true,
      },
    });

    return {
      id,
      message: 'File data updated successfully',
      code: 200,
    };
  }

  async remove(fileDataId: string) {
    const fileData = await this.paymentFilesDataRepo.findUnique({
      where: {
        id: fileDataId,
      },
      select: {
        id: true,
      },
    });

    if (!fileData?.id) {
      throw new NotFoundException(`File data with ${fileDataId} not found`);
    }

    await this.paymentFilesDataRepo.delete({
      where: {
        id: fileDataId,
      },
    });
  }
}

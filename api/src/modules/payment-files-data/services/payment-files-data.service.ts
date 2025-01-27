import { Injectable, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';

import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { IGetAllFilesDataFilters } from '../interfaces/get-all-files-data-filters.interface';
import { UpdateFileDataResponseDto } from '../dtos/response/update-file-data-response.dto';

@Injectable()
export class PaymentFilesDataService {
  constructor(
    private readonly paymentFilesDataRepo: PaymentFilesDataRepository,
  ) {}

  async getAllFileData(filters: IGetAllFilesDataFilters) {
    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [results, count] = await Promise.all([
      this.paymentFilesDataRepo.findMany({
        where: {
          paymentFileId: filters.fileId,
          createdAt: {
            gte: filters.startDate
              ? moment.utc(Number(filters.startDate)).toDate()
              : undefined,
            lte: filters.endDate
              ? moment.utc(Number(filters.endDate)).toDate()
              : undefined,
          },
        },
        skip,
        take,
        select: {
          id: true,
          name: true,
          address: true,
          paidAmount: true,
          document: true,
          birthDate: true,
          age: true,
          status: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.paymentFilesDataRepo.count({
        where: {
          paymentFileId: filters.fileId,
          createdAt: {
            gte: filters.startDate
              ? moment.utc(Number(filters.startDate)).toDate()
              : undefined,
            lte: filters.endDate
              ? moment.utc(Number(filters.endDate)).toDate()
              : undefined,
          },
        },
      }),
    ]);

    return {
      results,
      page: filters.page,
      pageSize: filters.pageSize,
      total: count,
    };
  }

  async update(
    fileDataId: string,
    updateFileDataDto: PaymentFilesDataDto,
  ): Promise<UpdateFileDataResponseDto> {
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

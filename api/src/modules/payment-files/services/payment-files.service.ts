import { BadRequestException, Injectable } from '@nestjs/common';
import chardet from 'chardet';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';

import { PrismaService } from '@/shared/database/prisma.service';
import { PaymentFilesDataRepository } from '@/shared/database/repositories/payment-files-data.repository';
import { PaymentFilesRepository } from '@/shared/database/repositories/payment-files.repository';
import { TransactionContext } from '@/shared/database/transaction.context';
import { isValidTextFile } from '@/shared/utils/is-valid-text-file';
import { IBatchItem } from '../interfaces/batch-item.interface';
import { IFile } from '../interfaces/file.interface';
import { IGetAllFilesFilters } from '../interfaces/get-all-files-filters.interface';
import { UploadFileResponseDto } from '../dtos/response/upload-file-response.dto';
import { GetAllFilesResponseDto } from '../dtos/response/get-all-files-response.dto';

@Injectable()
export class PaymentFilesService {
  private fileId: string;
  private fileName: string;

  constructor(
    private readonly paymentFilesRepo: PaymentFilesRepository,
    private readonly paymentFilesDataRepo: PaymentFilesDataRepository,
    private readonly prismaService: PrismaService,
    private readonly transactionContext: TransactionContext,
  ) {}

  async saveFileData(file: IFile): Promise<UploadFileResponseDto> {
    const encodeType = await chardet.detectFile(file.path);
    const fileStream = createReadStream(file.path).pipe(
      iconv.decodeStream(encodeType ?? 'utf-8'),
    );
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const batch: IBatchItem[] = [];
    const batchLength = 10000;
    this.fileName = file.originalname;

    let firstLineValid = false;
    for await (const line of rl) {
      if (!firstLineValid) {
        const isValid = isValidTextFile(line);

        if (!isValid) {
          throw new BadRequestException(
            'Invalid file content, only text files are allowed',
          );
        }

        firstLineValid = true;
      }

      const item = this.parseItemToDB(line);
      if (item) batch.push(item);

      if (batch.length === batchLength) {
        await this.saveBatchItems(batch);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await this.saveBatchItems(batch);
    }

    rl.close();

    return {
      id: this.fileId,
      message: 'File data saved successfully',
      code: 201,
    };
  }

  async getAllFiles(
    filters: IGetAllFilesFilters,
  ): Promise<GetAllFilesResponseDto> {
    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const results = await this.paymentFilesRepo.findMany({
      where: {
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
        fileName: true,
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      results,
      page: filters.page,
      pageSize: filters.pageSize,
    } as GetAllFilesResponseDto;
  }

  private async saveBatchItems(batch: IBatchItem[]) {
    return await this.prismaService.$transaction(async (prisma) => {
      this.transactionContext.set(prisma);

      if (!this.fileId) {
        const { id } = await this.paymentFilesRepo.create({
          data: {
            fileName: this.fileName,
            status: 'PENDING',
          },
        });
        this.fileId = id;
      }

      await this.paymentFilesDataRepo.createMany({
        data: batch.map((item) => ({
          ...item,
          paymentFileId: this.fileId,
          status: 'PENDING',
        })),
      });
    });
  }

  private parseItemToDB(line: string) {
    const name = line.slice(0, 15).trim();
    const age = parseInt(line.slice(15, 19).trim());
    const address = line.slice(19, 53).trim();
    const document = line.slice(53, 64).trim();
    const paidAmount = parseInt(line.slice(64, 80).trim());
    const birthDate = moment(line.slice(80, 88).trim(), 'YYYYMMDD').toDate();

    if (name && age && address && document && paidAmount && birthDate) {
      return {
        name,
        age,
        address,
        document,
        paidAmount,
        birthDate,
      };
    }
  }
}

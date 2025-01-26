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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

import { OptionalParseQueryDatePipe } from '@/shared/pipes/parse-status-payment-enum.pipe';
import { PaymentFilesDataDto } from '../dtos/payment-files-data.dto';
import { PaymentFilesDataService } from '../services/payment-files-data.service';
import { GetAllFileDataResponseDto } from '../dtos/response/get-all-file-data-response.dto';
import { UpdateFileDataResponseDto } from '../dtos/response/update-file-data-response.dto';

@ApiTags('File Data')
@Controller('transactions-guard/files-data')
export class PaymentFilesDataController {
  constructor(
    private readonly paymentFilesDataService: PaymentFilesDataService,
  ) {}

  @Get(':fileId')
  @ApiOperation({
    summary:
      'Lista todos os dados dos arquivos de pagamento com base ao ID do arquivo',
    description: `
      Retorna uma lista paginada de dados dos arquivos de pagamento.
      Permite filtrar por intervalo de datas.
    `,
  })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID do arquivo de pagamento',
    example: randomUUID(),
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Número da página para paginação',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    description: 'Tamanho da página para paginação',
    example: 10,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial para filtro timestamp',
    example: '1735700400000',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final para filtro timestamp',
    example: '1738292400000',
  })
  @ApiOkResponse({
    description: 'Dados de arquivos retornada com sucesso',
    type: GetAllFileDataResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred, please try again later',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Ocorreu um erro inesperado no servidor. Tente novamente mais tarde',
    schema: {
      example: {
        message: 'An unexpected error occurred, please try again later',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
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
  @ApiOperation({
    summary: 'Atualiza dados de um arquivo de pagamento',
    description: `
      Atualiza os dados de um arquivo de pagamento com base no ID fornecido.
      Permite atualizar o status, a data de confirmação e o nome do arquivo.
    `,
  })
  @ApiParam({
    name: 'fileDataId',
    description: 'ID único do arquivo a ser atualizado',
    example: randomUUID(),
  })
  @ApiBody({
    type: PaymentFilesDataDto,
    description: 'Dados para atualização do arquivo',
  })
  @ApiOkResponse({
    description: 'Dado do arquivo atualizado com sucesso',
    type: UpdateFileDataResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Arquivo não encontrado',
    schema: {
      example: {
        message: `File data with ${randomUUID()} not found`,
        code: HttpStatus.NOT_FOUND,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description:
      'Ocorreu um erro inesperado no servidor. Tente novamente mais tarde',
    schema: {
      example: {
        message: 'An unexpected error occurred, please try again later',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  update(
    @Param('fileDataId', ParseUUIDPipe) fileDataId: string,
    @Body() updateFileDataDto: PaymentFilesDataDto,
  ) {
    return this.paymentFilesDataService.update(fileDataId, updateFileDataDto);
  }

  @Delete(':fileDataId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove um dado de arquivo de pagamento',
    description: `
      Remove um arquivo de pagamento com base no ID fornecido.
      Retorna status 204 (No Content) em caso de sucesso.
    `,
  })
  @ApiParam({
    name: 'fileDataId',
    description: 'ID único do arquivo a ser deletado',
    example: randomUUID(),
  })
  @ApiNoContentResponse({
    description: 'Arquivo removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Arquivo não encontrado',
    schema: {
      example: {
        message: `File data with ${randomUUID()} not found`,
        code: HttpStatus.NOT_FOUND,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido fornecido',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Ocorreu um erro inesperado no servidor. Tente novamente mais tarde',
    schema: {
      example: {
        message: 'An unexpected error occurred, please try again later',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  removeFileData(@Param('fileDataId', ParseUUIDPipe) fileDataId: string) {
    return this.paymentFilesDataService.remove(fileDataId);
  }
}

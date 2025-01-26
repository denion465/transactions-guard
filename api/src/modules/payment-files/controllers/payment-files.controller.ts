import {
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OptionalParseQueryDatePipe } from '@/shared/pipes/parse-status-payment-enum.pipe';
import { IFile } from '../interfaces/file.interface';
import { FileRequiredPipe } from '../pipes/file-required.pipe';
import { PaymentFilesService } from '../services/payment-files.service';
import { GetAllFilesResponse } from '../dtos/response/get-all-files-response.dto';
import { UploadFileResponseDto } from '../dtos/response/upload-file-response.dto';

@ApiTags('Upload Files')
@Controller('transactions-guard/files')
export class PaymentFilesController {
  constructor(private readonly paymentFilesService: PaymentFilesService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload de arquivo de pagamento',
    description: `
      Endpoint destinado ao envio de arquivos de pagamento.
      O arquivo deve conter dados em formato textual, independentemente da sua extensão.
  `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Arquivo de pagamento salvo com sucesso',
    type: UploadFileResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erro ao salvar o arquivo de pagamento',
    schema: {
      example: {
        message: 'Invalid file content, only text files are allowed',
        code: HttpStatus.BAD_REQUEST,
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
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp' }))
  @UsePipes(FileRequiredPipe)
  uploadFile(@UploadedFile() file: IFile) {
    return this.paymentFilesService.saveFileData(file);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os arquivos de pagamento',
    description: `
      Retorna uma lista paginada de arquivos de pagamento.
      Permite filtrar por intervalo de datas.
    `,
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
    description: 'Lista de arquivos retornada com sucesso',
    type: GetAllFilesResponse,
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

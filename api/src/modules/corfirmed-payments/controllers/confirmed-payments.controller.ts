import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

import { ConfirmedPaymentsService } from '../services/confirmed-payments.service';
import { ConfirmedPaymentsResponseDto } from '../dtos/response/confirmed-payments-response.dto';

@ApiTags('Confirmed Payments')
@Controller('transactions-guard')
export class ConfirmedPaymentsController {
  constructor(
    private readonly confirmedPaymentsService: ConfirmedPaymentsService,
  ) {}

  @Post('confirmed-payments/:fileId')
  @ApiOperation({
    summary: 'Confirmar pagamentos de um arquivo',
    description: `
      Confirma os pagamentos de um arquivo com base no ID do arquivo fornecido.
    `,
  })
  @ApiParam({
    name: 'fileId',
    description: 'ID único do arquivo a ser confirmado',
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Pagamentos confirmados com sucesso',
    type: ConfirmedPaymentsResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Arquivo não encontrado',
    schema: {
      example: {
        message: `File with ${randomUUID()} not found or already confirmed`,
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
  confirmPayments(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return this.confirmedPaymentsService.corfimPayments(fileId);
  }

  @Get('confirmed-payments/export-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="payments.csv"')
  @ApiOperation({
    summary: 'Exportar pagamentos confirmados em formato CSV',
    description: `
      Exporta todos os pagamentos confirmados em um arquivo CSV.
      O arquivo será baixado automaticamente com o nome "payments.csv".
    `,
  })
  @ApiProduces('text/csv')
  @ApiOkResponse({
    description: 'Arquivo CSV gerado com sucesso',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
        },
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
  exportCSV(@Res() res: Response) {
    const csvStream = this.confirmedPaymentsService.getConfirmedPaymentsCsv();
    csvStream.pipe(res);
  }
}

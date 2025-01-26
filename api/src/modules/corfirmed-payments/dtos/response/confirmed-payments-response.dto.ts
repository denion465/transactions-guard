import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmedPaymentsResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Payment data successfully confirmed',
  })
  message: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: HttpStatus.OK,
  })
  code: number;
}

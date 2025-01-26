import { PaymentStatusEnum } from '@/shared/enums/payment-status-enum';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

class Results {
  @ApiProperty({
    description: 'Status do pagamento',
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @ApiProperty({
    description: 'ID único do arquivo',
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'pagamentos-outubro.txt',
  })
  fileName: string;

  @ApiProperty({
    description: 'Data de criação do arquivo',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;
}

export class GetAllFilesResponseDto {
  @ApiProperty({
    description: 'Lista de arquivos encontrados',
    type: Results,
  })
  results: Results[];

  @ApiProperty({
    description: 'Número da página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Tamanho da página',
    example: 10,
  })
  pageSize: number;
}

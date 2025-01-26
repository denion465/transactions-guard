import { PaymentStatusEnum } from '@/shared/enums/payment-status-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

class Results {
  @ApiProperty({
    description: 'ID único do dado',
    example: randomUUID(),
  })
  fileId: string;

  @ApiProperty({
    description: 'Nome do pagante',
    example: 'Maria Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Endereço do pagante',
    example: 'Rua das Flores, 123',
  })
  address: string;

  @ApiProperty({
    description: 'Valor pago',
    example: 1000,
  })
  value: Decimal;

  @ApiProperty({
    description: 'Documento do pagante',
    example: '12345678900',
  })
  document: string;

  @ApiProperty({
    description: 'Data de nascimento do pagante',
    example: '1990-01-01',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Idade do pagante',
    example: 33,
  })
  age: number;

  @ApiProperty({
    description: 'Status da confirmação do dado',
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @ApiProperty({
    description: 'Data de criação do dado',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;
}

export class GetAllFileDataResponseDto {
  @ApiProperty({
    description: 'Dados de arquivos encontrados',
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

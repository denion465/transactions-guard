import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class UploadFileResponseDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'ID único gerado para o arquivo processado',
  })
  id: string;

  @ApiProperty({
    example: 'File data saved successfully',
    description: 'Mensagem de confirmação do processamento',
  })
  message: string;

  @ApiProperty({
    example: HttpStatus.CREATED,
    description: 'Código de status HTTP retornado',
  })
  code: number;
}

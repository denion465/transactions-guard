import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class UpdateFileDataResponseDto {
  @ApiProperty({
    description: 'ID único do dado',
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    description: 'Mensagem de retorno',
    example: 'File data updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Código de retorno',
    example: 200,
  })
  code: number;
}

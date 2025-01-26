import { IsOnlyValidDate } from '@/shared/decorators/is-only-valid-date.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class PaymentFilesDataDto {
  @ApiProperty({
    description: 'Nome do pagante',
    example: 'Maria Silva',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Idade do pagante',
    example: 33,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  age: number;

  @ApiProperty({
    description: 'Endereço do pagante',
    example: 'Rua das Flores, 123',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Documento do pagante',
    example: '12345678900',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'The document must be exactly 11 characters long.',
  })
  document: string;

  @ApiProperty({
    description: 'Valor pago',
    example: 1000,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  paidAmount: number;

  @ApiProperty({
    description: 'Data de nascimento do pagante',
    example: '1990-01-01',
  })
  @IsOnlyValidDate()
  @IsOptional()
  @IsNotEmpty()
  birthDate: string;
}

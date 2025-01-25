import { IsOnlyValidDate } from '@/shared/decorators/is-only-valid-date.decorator';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class PaymentFilesDataDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'The document must be exactly 11 characters long.',
  })
  document: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  paidAmount: number;

  @IsOnlyValidDate()
  @IsOptional()
  @IsNotEmpty()
  birthDate: string;
}

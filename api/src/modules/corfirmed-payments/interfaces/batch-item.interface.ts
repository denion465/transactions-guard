import { Decimal } from '@prisma/client/runtime/library';

export interface IBatchItem {
  id: string;
  name: string;
  age: number;
  address: string;
  document: string;
  paidAmount: Decimal;
  birthDate: Date;
}

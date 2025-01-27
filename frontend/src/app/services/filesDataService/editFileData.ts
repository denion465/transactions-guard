import moment from 'moment';
import { httpClient } from '../httpClient';

interface IPatchBody {
  name: string;
  age: number;
  address: string;
  document: string;
  paidAmount: number;
  birthDate: string;
}

export async function editFileData(fileId: string, body: IPatchBody) {
  if (body.birthDate) {
    body.birthDate = moment(body.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

  if (body.paidAmount) {
    body.paidAmount = Number(body.paidAmount);
  }

  const { data } = await httpClient.patch(`/files-data/${fileId}`, {
    ...body,
  });

  return data;
}

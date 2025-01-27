import { httpClient } from '../httpClient';

export async function confirmPayments(fileId: string) {
  const { data } = await httpClient.post(`/confirmed-payments/${fileId}`);

  return data;
}

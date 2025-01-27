import { httpClient } from '../httpClient';

export async function removeFileData(fileId: string) {
  const { data } = await httpClient.delete(`/files-data/${fileId}`);

  return data;
}

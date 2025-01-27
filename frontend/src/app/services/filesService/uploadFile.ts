import { httpClient } from '../httpClient';

export async function uploadFile(file: Blob) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await httpClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}

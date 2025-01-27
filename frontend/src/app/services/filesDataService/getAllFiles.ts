import { httpClient } from '../httpClient';

export interface IQueryParamsGetAllFileData {
  page: number;
  pageSize: number;
}

export async function getAllFileData(fileId: string, queryParams: IQueryParamsGetAllFileData) {
  const { data } = await httpClient.get(`/files-data/${fileId}`, {
    params: queryParams
  })

  return data;
}

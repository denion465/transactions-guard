import { httpClient } from '../httpClient';

export interface IQueryParamsGetAllFiles {
  page: number;
  pageSize: number;
  startDate?: number;
  endDate?: number;
}

export async function getAllFiles(queryParams: IQueryParamsGetAllFiles) {
  const { data } = await httpClient.get('/files', {
    params: queryParams
  })

  return data;
}

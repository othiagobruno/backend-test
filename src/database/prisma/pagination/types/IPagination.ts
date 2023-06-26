export class IFilters {
  search?: string;
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: 'desc' | 'asc';
}

interface ReponseFilter extends IFilters {
  total: number;
}

export class IPaginationReponse<T> extends IFilters {
  meta: ReponseFilter;
  data: T;
}

export type IPagination<T> = Promise<IPaginationReponse<T>>;

import { IFilters } from './types/IPagination';

export const getPagination = ({
  per_page = 10,
  page = 1,
  order = 'desc',
  order_by = 'id',
}: IFilters) => {
  const skip = Number((page || 1) - 1);
  const perPage = Number(per_page ?? 10);
  return {
    take: perPage,
    skip: skip > 0 ? skip * perPage : 0,
    orderBy: {
      [order_by || 'id']: order || 'desc',
    },
  };
};

const transformPagination = ({ per_page, page, order, order_by }: IFilters) => {
  return {
    per_page: Number(per_page ?? 10),
    page: Number(page || 1),
    order: order || 'desc',
    order_by: order_by || 'id',
  };
};

export const paginate = (meta: IFilters, data: any, total: number) => {
  const next_page: boolean =
    Math.ceil(total / (meta.per_page ?? 10)) > (meta.page ?? 1);

  const previus_page: boolean = meta.page > 1 ? true : false;

  return {
    meta: { ...transformPagination(meta), total, next_page, previus_page },
    data,
  };
};

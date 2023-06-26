import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IFilters } from '../pagination/types/IPagination';
import { getPagination, paginate } from '../pagination/pagination';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async $paginate<T extends { where?: any }>(
    model: any,
    query: T,
    filters: IFilters,
  ) {
    const pagination = getPagination(filters);
    const [total, result] = await this.$transaction([
      model.count({
        where: query.where,
      }),
      model.findMany({
        ...pagination,
        ...query,
      }),
    ]);
    return paginate(filters, result, total);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

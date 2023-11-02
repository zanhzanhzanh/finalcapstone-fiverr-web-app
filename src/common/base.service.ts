import { Prisma } from '@prisma/client';
import { BaseModel } from './base.model';
import { Pagination } from './object/pagination.object';

export class BaseService<T extends BaseModel> {
  constructor(protected model: any) {}

  async findAll(models?: string[]): Promise<T[]> {
    return await this.model.findMany({
      // Show SubObjects
      include: models !== undefined ? models.reduce((arr, item) => {
        arr[item] = true;
        return arr;
      }, {}) : undefined
    });
  }

  async findOne(modelWhereUniqueInput : Prisma.Args<T, 'findUnique'>): Promise<T | null> {
    return await this.model.findUnique({
      where: modelWhereUniqueInput,
    });
  }

  async create(data : Prisma.Args<T, 'create'>): Promise<T> {
    return await this.model.create({
      data
    });
  }

  async update(params: {
    data: Prisma.Args<T, 'update'>;
    where: Prisma.Args<T, 'findUnique'>;
  }): Promise<T> {
    const { data, where } = params;
    return await this.model.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.Args<T, 'findUnique'>): Promise<T> {
    return await this.model.delete({
      where,
    });
  }

  async findAllWithPagination(condition: Pagination): Promise<T[]> {
    // Finding By Propety
    const definedCondition = condition.propertyKey !== undefined ? { [condition.propertyKey] : { contains: condition.keyQuery } } : undefined;

    return await this.model.findMany({
      skip: (condition.pageIndex - 1) * condition.pageSize || 1,
      take: condition.pageSize || 1,
      where: {
        ...definedCondition
      },
    })
  }
}

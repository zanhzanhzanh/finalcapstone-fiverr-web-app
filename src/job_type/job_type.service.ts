import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { job_type } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JobTypeService extends BaseService<job_type> {
  constructor(protected prisma: PrismaService) {
    super(prisma.job_type);
  }
}
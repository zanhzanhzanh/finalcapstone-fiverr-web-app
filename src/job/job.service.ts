import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BaseService } from 'src/common/base.service';
import { job } from '@prisma/client';

@Injectable()
export class JobService extends BaseService<job> {
  constructor(protected prisma: PrismaService) {
    super(prisma.job);
  }
}

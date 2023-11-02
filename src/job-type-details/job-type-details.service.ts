import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { job_type_details } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JobTypeDetailsService extends BaseService<job_type_details> {
  constructor(protected prisma: PrismaService) {
    super(prisma.job_type_details);
  }
}

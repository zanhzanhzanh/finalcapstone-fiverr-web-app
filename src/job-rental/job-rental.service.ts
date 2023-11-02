import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { job_rental } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JobRentalService extends BaseService<job_rental> {
  constructor(protected prisma: PrismaService) {
    super(prisma.job_rental);
  }
}

import { Module } from '@nestjs/common';
import { JobTypeDetailsService } from './job-type-details.service';
import { JobTypeDetailsController } from './job-type-details.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [JobTypeDetailsController],
  providers: [JobTypeDetailsService, PrismaService],
})
export class JobTypeDetailsModule {}

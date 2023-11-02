import { Module } from '@nestjs/common';
import { JobTypeService } from './job_type.service';
import { JobTypeController } from './job_type.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [JobTypeController],
  providers: [JobTypeService, PrismaService],
})
export class JobTypeModule {}

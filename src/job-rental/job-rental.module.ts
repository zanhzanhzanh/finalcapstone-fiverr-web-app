import { Module } from '@nestjs/common';
import { JobRentalService } from './job-rental.service';
import { JobRentalController } from './job-rental.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [JobRentalController],
  providers: [JobRentalService, PrismaService],
})
export class JobRentalModule {}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, UseFilters } from '@nestjs/common';
import { JobRentalService } from './job-rental.service';
import { CreateJobRentalDto } from './dto/create-job-rental.dto';
import { UpdateJobRentalDto } from './dto/update-job-rental.dto';
import { ResponseObject } from 'src/common/object/response.object';
import { job_rental } from '@prisma/client';
import { UUID } from 'crypto';
import { uuidToBuffer } from 'src/common/convert.common';
import { Pagination } from 'src/common/object/pagination.object';
import { ApiTags } from '@nestjs/swagger';
import { ErrorFilter } from 'src/common/filter/error.filter';

@ApiTags('Job-Rental')
@Controller('job-rental')
@UseFilters(ErrorFilter)
export class JobRentalController {
  constructor(private readonly jobRentalService: JobRentalService) {}

  @Get()
  async findAll(): Promise<ResponseObject<job_rental[]>> {
    return new ResponseObject<job_rental[]>(HttpStatus.OK, 'Success', await this.jobRentalService.findAll(['user', 'job']));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_rental>> {
    return new ResponseObject<job_rental>(HttpStatus.OK, 'Success', await this.jobRentalService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<job_rental[]>> {
    return new ResponseObject<job_rental[]>(HttpStatus.OK, 'Success', await this.jobRentalService.findAllWithPagination(pagination));
  }

  @Post()
  async create(@Body() createJobRentalDto: CreateJobRentalDto): Promise<ResponseObject<job_rental>> {
    return new ResponseObject<job_rental>(HttpStatus.OK, 'Success', await this.jobRentalService.create(CreateJobRentalDto.getCreateObject(createJobRentalDto)));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateJobRentalDto: UpdateJobRentalDto): Promise<ResponseObject<job_rental>> {
    return new ResponseObject<job_rental>(HttpStatus.OK, 'Success', await this.jobRentalService.update({ data: UpdateJobRentalDto.getUpdateObject(updateJobRentalDto), where: { id: uuidToBuffer(id) }}));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_rental>> {
    return new ResponseObject<job_rental>(HttpStatus.OK, 'Success', await this.jobRentalService.remove({ id: uuidToBuffer(id) }));
  }
}

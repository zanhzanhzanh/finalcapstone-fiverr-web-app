import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { JobTypeService } from './job_type.service';
import { CreateJobTypeDto } from './dto/create-job_type.dto';
import { UpdateJobTypeDto } from './dto/update-job_type.dto';
import { ApiTags } from '@nestjs/swagger';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { ResponseObject } from 'src/common/object/response.object';
import { job_type } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';
import { uuidToBuffer } from 'src/common/convert.common';
import { Pagination } from 'src/common/object/pagination.object';

@ApiTags('Job-Type')
@Controller('job-type')
@UseFilters(ErrorFilter)
export class JobTypeController {
  constructor(private readonly jobTypeService: JobTypeService) {}

  @Get()
  async findAll(): Promise<ResponseObject<job_type[]>> {
    return new ResponseObject<job_type[]>(HttpStatus.OK, 'Success', await this.jobTypeService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_type>> {
    return new ResponseObject<job_type>(HttpStatus.OK, 'Success', await this.jobTypeService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<job_type[]>> {
    return new ResponseObject<job_type[]>(HttpStatus.OK, 'Success', await this.jobTypeService.findAllWithPagination(pagination));
  }

  @Post()
  async create(@Body() createJobTypeDto: CreateJobTypeDto): Promise<ResponseObject<job_type>> {
    return new ResponseObject<job_type>(HttpStatus.OK, 'Success', await this.jobTypeService.create({ id: uuidToBuffer(uuidv4()), ...createJobTypeDto }));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateJobTypeDto: UpdateJobTypeDto): Promise<ResponseObject<job_type>> {
    return new ResponseObject<job_type>(HttpStatus.OK, 'Success', await this.jobTypeService.update({ data: updateJobTypeDto, where: { id: uuidToBuffer(id) }}));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_type>> {
    return new ResponseObject<job_type>(HttpStatus.OK, 'Success', await this.jobTypeService.remove({ id: uuidToBuffer(id) }));
  }
}

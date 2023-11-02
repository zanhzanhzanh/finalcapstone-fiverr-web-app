import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseObject } from 'src/common/object/response.object';
import { job } from '@prisma/client';
import { UUID } from 'crypto';
import { findAndDelImage, uploadImage } from 'src/util/bucket.util';
import { Pagination } from 'src/common/object/pagination.object';
import { uuidToBuffer } from 'src/common/convert.common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';

@ApiTags('Job')
@Controller('job')
@UseFilters(ErrorFilter)
export class JobController {
  constructor(private readonly jobService: JobService,
              @InjectS3() private readonly s3: S3,
              private configService: ConfigService
            ) {}

  @Get()
  async findAll(): Promise<ResponseObject<job[]>> {
    return new ResponseObject<job[]>(HttpStatus.OK, 'Success', await this.jobService.findAll(['user', 'job_type_details']));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job>> {
    return new ResponseObject<job>(HttpStatus.OK, 'Success', await this.jobService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<job[]>> {
    return new ResponseObject<job[]>(HttpStatus.OK, 'Success', await this.jobService.findAllWithPagination(pagination));
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createJobDto: CreateJobDto): Promise<ResponseObject<job>> {
    const imagePath: string = await uploadImage(this.s3, this.configService, file);
    return new ResponseObject<job>(HttpStatus.OK, 'Success', await this.jobService.create(CreateJobDto.getCreateObject(createJobDto, imagePath)));
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id', ParseUUIDPipe) id: UUID, @UploadedFile() file: Express.Multer.File, @Body() updateJobDto: UpdateJobDto): Promise<ResponseObject<job>> {
    // Convert
    const convertBuffer: Buffer = uuidToBuffer(id);

    let imagePath = null
    if(file !== undefined){
      // Delete Old Image on S3
      await findAndDelImage('job', this.s3, this.configService, convertBuffer);
      // Create New Image on S3
      imagePath = await uploadImage(this.s3, this.configService, file);
    }
    return new ResponseObject<job>(HttpStatus.OK, 'Success', await this.jobService.update({ data: UpdateJobDto.getUpdateObject(updateJobDto, imagePath), where: { id: convertBuffer }}));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job>> {
    // Convert
    const convertBuffer: Buffer = uuidToBuffer(id);
    // Delete Image Path on S3
    await findAndDelImage('job', this.s3, this.configService, convertBuffer);
    return new ResponseObject<job>(HttpStatus.OK, 'Success', await this.jobService.remove({ id: uuidToBuffer(id) }));
  }
}

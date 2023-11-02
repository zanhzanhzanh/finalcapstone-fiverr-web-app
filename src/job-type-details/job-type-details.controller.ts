import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, UseFilters, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JobTypeDetailsService } from './job-type-details.service';
import { CreateJobTypeDetailDto } from './dto/create-job-type-detail.dto';
import { UpdateJobTypeDetailDto } from './dto/update-job-type-detail.dto';
import { ResponseObject } from 'src/common/object/response.object';
import { UUID } from 'crypto';
import { Pagination } from 'src/common/object/pagination.object';
import { job_type_details } from '@prisma/client';
import { uuidToBuffer } from 'src/common/convert.common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { findAndDelImage, uploadImage } from 'src/util/bucket.util';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import { ErrorFilter } from 'src/common/filter/error.filter';

@ApiTags('Job-Type-Details')
@Controller('job-type-details')
@UseFilters(ErrorFilter)
export class JobTypeDetailsController {
  constructor(private readonly jobTypeDetailsService: JobTypeDetailsService,
              @InjectS3() private readonly s3: S3,
              private configService: ConfigService
            ) {}

  @Get()
  async findAll(): Promise<ResponseObject<job_type_details[]>> {
    return new ResponseObject<job_type_details[]>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.findAll(['job_type']));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_type_details>> {
    return new ResponseObject<job_type_details>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<job_type_details[]>> {
    return new ResponseObject<job_type_details[]>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.findAllWithPagination(pagination));
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createJobTypeDetailDto: CreateJobTypeDetailDto): Promise<ResponseObject<job_type_details>> {
    const imagePath: string = await uploadImage(this.s3, this.configService, file);
    return new ResponseObject<job_type_details>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.create(CreateJobTypeDetailDto.getCreateObject(createJobTypeDetailDto, imagePath)));
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id', ParseUUIDPipe) id: UUID, @UploadedFile() file: Express.Multer.File, @Body() updateJobTypeDetailDto: UpdateJobTypeDetailDto): Promise<ResponseObject<job_type_details>> {
    // Convert
    const convertBuffer: Buffer = uuidToBuffer(id);

    let imagePath = null
    if(file !== undefined){
      // Delete Old Image on S3
      await findAndDelImage('job_type_details', this.s3, this.configService, convertBuffer);
      // Create New Image on S3
      imagePath = await uploadImage(this.s3, this.configService, file);
    }
    return new ResponseObject<job_type_details>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.update({ data: UpdateJobTypeDetailDto.getUpdateObject(updateJobTypeDetailDto, imagePath), where: { id: convertBuffer }}));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<job_type_details>> {
    // Convert
    const convertBuffer: Buffer = uuidToBuffer(id);
    // Delete Image Path on S3
    await findAndDelImage('job_type_details', this.s3, this.configService, convertBuffer);
    return new ResponseObject<job_type_details>(HttpStatus.OK, 'Success', await this.jobTypeDetailsService.remove({ id: convertBuffer }));
  }
}

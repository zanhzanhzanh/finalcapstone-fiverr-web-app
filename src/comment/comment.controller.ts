import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, UseFilters } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { comment } from '@prisma/client';
import { ResponseObject } from 'src/common/object/response.object';
import { UUID } from 'crypto';
import { Pagination } from 'src/common/object/pagination.object';
import { uuidToBuffer } from 'src/common/convert.common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { updateJob } from 'src/util/comment.util';

@ApiTags('Comment')
@Controller('comment')
@UseFilters(ErrorFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(): Promise<ResponseObject<comment[]>> {
    return new ResponseObject<comment[]>(HttpStatus.OK, 'Success', await this.commentService.findAll(['user', 'job']));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<comment>> {
    return new ResponseObject<comment>(HttpStatus.OK, 'Success', await this.commentService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<comment[]>> {
    return new ResponseObject<comment[]>(HttpStatus.OK, 'Success', await this.commentService.findAllWithPagination(pagination));
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<ResponseObject<comment>> {
    const responsePrisma: comment = await this.commentService.create(CreateCommentDto.getCreateObject(createCommentDto));
    // Update Relational Object Job
    await updateJob(responsePrisma, 1);
    return new ResponseObject<comment>(HttpStatus.OK, 'Success', responsePrisma);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateCommentDto: UpdateCommentDto): Promise<ResponseObject<comment>> {
    const responsePrisma: comment = await this.commentService.update({ data: UpdateCommentDto.getUpdateObject(updateCommentDto), where: { id: uuidToBuffer(id) }})
    // Update Relational Object Job
    await updateJob(responsePrisma, 0);
    return new ResponseObject<comment>(HttpStatus.OK, 'Success', responsePrisma);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<comment>> {
    const responsePrisma: comment = await this.commentService.remove({ id: uuidToBuffer(id) });
    // Update Relational Object Job
    await updateJob(responsePrisma, -1);
    return new ResponseObject<comment>(HttpStatus.OK, 'Success', responsePrisma);
  }
}

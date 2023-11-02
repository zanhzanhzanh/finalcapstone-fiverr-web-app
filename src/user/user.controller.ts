import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseFilters, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ResponseObject } from 'src/common/object/response.object';
import { user } from '@prisma/client';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { UUID } from 'crypto';
import { uuidToBuffer, toISOTime } from 'src/common/convert.common';
import { Pagination } from 'src/common/object/pagination.object';

@ApiTags('User')
@Controller('user')
@UseFilters(ErrorFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ResponseObject<user[]>> {
    return new ResponseObject<user[]>(HttpStatus.OK, 'Success', await this.userService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<user>> {
    return new ResponseObject<user>(HttpStatus.OK, 'Success', await this.userService.findOne({ id: uuidToBuffer(id) }));
  }

  @Post('pagination')
  async findAllWithPagination(@Body() pagination: Pagination): Promise<ResponseObject<user[]>> {
    return new ResponseObject<user[]>(HttpStatus.OK, 'Success', await this.userService.findAllWithPagination(pagination));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseObject<user>> {
    // Convert Date Format
    toISOTime(createUserDto, 'birthday');
    return new ResponseObject<user>(HttpStatus.OK, 'Success', await this.userService.create({ id: uuidToBuffer(uuidv4()), role: 'USER' ,...createUserDto }));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateUserDto: UpdateUserDto): Promise<ResponseObject<user>> {
    // Convert Date Format
    toISOTime(updateUserDto, 'birthday');
    return new ResponseObject<user>(HttpStatus.OK, 'Success', await this.userService.update({ data: updateUserDto, where: { id: uuidToBuffer(id) }}));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<ResponseObject<user>> {
    return new ResponseObject<user>(HttpStatus.OK, 'Success', await this.userService.remove({ id: uuidToBuffer(id) }));
  }
}

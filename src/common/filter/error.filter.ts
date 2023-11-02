import { ExceptionFilter, Catch, HttpStatus, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseObject } from '../object/response.object';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle BadRequestException
    if(exception instanceof BadRequestException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    }

    // Handle PrismaClientKnownRequestError
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // For Record Not Found
      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json(new ResponseObject<[]>(HttpStatus.NOT_FOUND, `${exception.meta.cause}`, []))
      }

      // For Exist Field
      else if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json(new ResponseObject<[]>(HttpStatus.CONFLICT, `Exist ${exception.meta.target}`, []))
      }

      // For Object Relation Not Found
      else if (exception.code === 'P2003') {
        response.status(HttpStatus.CONFLICT).json(new ResponseObject<[]>(HttpStatus.CONFLICT, `Not found record with ${exception.meta.field_name}`, []))
      }

      // Other Code
      else response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ResponseObject<string>(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', exception.message))
    }

    // Handle Http
    else response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ResponseObject<string>(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', exception.message))
  }
}
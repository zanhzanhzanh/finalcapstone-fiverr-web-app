import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { comment } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentService extends BaseService<comment> {
  constructor(protected prisma: PrismaService) {
    super(prisma.comment);
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { user } from '@prisma/client';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class UserService extends BaseService<user> {
  constructor(protected prisma: PrismaService) {
    super(prisma.user);
  }
}

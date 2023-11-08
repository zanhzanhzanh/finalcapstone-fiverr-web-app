import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// This file replace Represent Name and handle Error
export class LocalAuthGuard extends AuthGuard('local') {}
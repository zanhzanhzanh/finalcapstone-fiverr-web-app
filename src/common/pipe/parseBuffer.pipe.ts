import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseBufferPipe implements PipeTransform<string, Buffer> {
  transform(value: string): Buffer {
    const val: Buffer = Buffer.from(value, 'hex');
    return val;
  }
}
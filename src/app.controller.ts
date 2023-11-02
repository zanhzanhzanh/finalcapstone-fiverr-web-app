import { Body, Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/demo')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDemo(@Req() req: Request, @Body() body: any): string {
    // let { id } = req.params;
    return 'demo';
  }
}

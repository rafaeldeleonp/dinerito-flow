import { Body, Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Body() dto: { email: string }): Promise<boolean> {
    return this.appService.getHello(dto.email);
  }
}

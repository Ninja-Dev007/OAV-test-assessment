import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Server status' })
  @ApiResponse({
    status: 201,
    description: 'Check the status of server',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

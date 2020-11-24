import { Controller, Get, Inject, Query } from '@nestjs/common';
import { EchoClient } from './echo.client';
import { EchoResponse, ECHO_SERVICE_CLIENT, Params } from './types';

@Controller()
export class AppController {
  constructor(
    @Inject(ECHO_SERVICE_CLIENT) private readonly client: EchoClient,
  ) {}

  @Get()
  echo(@Query() params?: Params): Promise<EchoResponse> {
    return this.client.get(params);
  }
}

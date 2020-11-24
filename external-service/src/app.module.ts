import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EchoClient } from './echo.client';
import { ECHO_SERVICE_CLIENT } from './types';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [{ provide: ECHO_SERVICE_CLIENT, useClass: EchoClient }],
})
export class AppModule {}

import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpStatus, INestApplication } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import { EchoClientFake } from './support/echo-client.fake';
import { ECHO_SERVICE_CLIENT } from '../src/types';
import { createHttpServiceFake } from './support/http-service.fake';
import { stat } from 'fs';
import { response } from 'express';

describe('Endpoints', () => {
  let app: INestApplication;
  let echoClient: EchoClientFake;

  beforeEach(async () => {
    const { httpService, httpMock } = createHttpServiceFake();

    // Prevent any accidental HTTP connections
    httpMock.onAny().reply(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: 'External HTTP requests are prohibited in end-to-end tests',
    });

    echoClient = new EchoClientFake();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .overrideProvider(ECHO_SERVICE_CLIENT)
      .useValue(echoClient)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);

    await app.init();
  });

  describe('GET /', () => {
    it('returns the response from the server when successful', async () => {
      echoClient.addResponse({
        request: { params: { key: 'value' } },

        response: {
          args: { key: 'value' },
          headers: { Header: 'value' },
          url: 'http://host.example',
        },
      });

      const { status, body } = await request(app.getHttpServer()).get(
        '/?key=value',
      );

      expect(status).toBe(HttpStatus.OK);

      expect(body).toEqual({
        args: { key: 'value' },
        headers: { Header: 'value' },
        url: 'http://host.example',
      });
    });

    it('responds with an error status when the request fails', async () => {
      echoClient.addResponse({ request: { params: {} }, response: null });

      const { status } = await request(app.getHttpServer()).get('/');
      expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

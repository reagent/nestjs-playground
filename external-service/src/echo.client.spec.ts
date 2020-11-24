import AxiosMockAdapter from 'axios-mock-adapter';

import { HttpService, HttpStatus } from '@nestjs/common';

import { EchoClient } from './echo.client';
import { createHttpServiceFake } from '../test/support/http-service.fake';

describe(`${EchoClient.name}`, () => {
  const baseUrl = 'https://postman-echo.com';

  let httpMock: AxiosMockAdapter;
  let client: EchoClient;

  beforeEach(() => {
    let httpService: HttpService;
    ({ httpMock, httpService } = createHttpServiceFake());

    client = new EchoClient(httpService);
  });

  afterEach(() => httpMock.resetHandlers());

  describe('get()', () => {
    it('performs a GET request against the endpoint and returns a response', async () => {
      httpMock.onGet(`${baseUrl}/get`).reply(HttpStatus.OK, {
        args: {},
        headers: { Key: 'value' },
        url: `${baseUrl}/get`,
      });

      const response = await client.get();

      expect(response).toEqual({
        args: {},
        headers: { Key: 'value' },
        url: 'https://postman-echo.com/get',
      });
    });

    it('passes parameters to the endpoint', async () => {
      httpMock
        .onGet(`${baseUrl}/get`, { params: { one: 'one', two: 'two' } })
        .reply(HttpStatus.OK, {
          args: { one: 'one', two: 'two' },
          headers: { Key: 'value' },
          url: `${baseUrl}/get?one=one&two=two`,
        });

      const response = await client.get({ one: 'one', two: 'two' });

      expect(response).toEqual({
        args: { one: 'one', two: 'two' },
        headers: { Key: 'value' },
        url: 'https://postman-echo.com/get?one=one&two=two',
      });
    });

    it('throws an error when recieving a non-success HTTP status', async () => {
      httpMock.onGet(`${baseUrl}/get`).reply(HttpStatus.INTERNAL_SERVER_ERROR);

      await expect(client.get()).rejects.toThrow(
        'Request failed with status code 500',
      );
    });

    it('throws an error when encountering a network error', async () => {
      httpMock.onGet(`${baseUrl}/get`).networkError();

      await expect(client.get()).rejects.toThrow('Network Error');
    });
  });
});

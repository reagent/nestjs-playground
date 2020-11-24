import { HttpService, Injectable } from '@nestjs/common';
import { Params, EchoResponse, EchoServiceClient } from './types';
import { config } from './config';

@Injectable()
export class EchoClient implements EchoServiceClient {
  constructor(private readonly http: HttpService) {}

  async get(params?: Params): Promise<EchoResponse> {
    const response = await this.http
      .get<EchoResponse>('/get', { params, baseURL: config.baseUri })
      .toPromise();

    return response.data;
  }
}

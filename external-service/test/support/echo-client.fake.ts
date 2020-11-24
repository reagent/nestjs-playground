import { Res } from '@nestjs/common';
import { EchoResponse, EchoServiceClient, Params } from '../../src/types';

class ResponseRegistry {
  private storage: Record<string, EchoResponse[]> = {};

  add(params: Params, response: EchoResponse) {
    const key = this.hash(params);

    if (!this.storage[key]) {
      this.storage[key] = [];
    }

    this.storage[key].push(response);
  }

  responseFor(params: Params): EchoResponse | undefined {
    const key = this.hash(params);
    return (this.storage[key] || []).shift();
  }

  private hash(params: Params): string {
    return Object.keys(params)
      .sort()
      .map((k) => `${k}:${params[k]}`)
      .join('|');
  }
}

type ResponseConfiguration = {
  request: { params: Params };
  response?: EchoResponse;
};

export class EchoClientFake implements EchoServiceClient {
  private registry = new ResponseRegistry();

  addResponse(config: ResponseConfiguration): void {
    this.registry.add(config.request.params, config.response);
  }

  get(params: Params = {}): Promise<EchoResponse> {
    const response = this.registry.responseFor(params);

    if (response) {
      return Promise.resolve(response);
    }

    return Promise.reject(
      `Request failed for params: ${JSON.stringify(params)}`,
    );
  }
}

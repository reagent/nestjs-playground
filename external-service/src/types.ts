const ECHO_SERVICE_CLIENT = 'ECHO_SERVICE_CLIENT';

type Map = Record<string, any>;

type Params = Record<string, string>;

type EchoResponse = {
  args: Map;
  headers: Map;
  url: string;
};

interface EchoServiceClient {
  get(params?: Params): Promise<EchoResponse>;
}

export { Params, EchoResponse, ECHO_SERVICE_CLIENT, EchoServiceClient };

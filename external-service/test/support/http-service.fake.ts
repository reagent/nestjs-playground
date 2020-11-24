import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { HttpService } from '@nestjs/common';

type HttpFakeConfig = {
  httpService: HttpService;
  httpMock: AxiosMockAdapter;
};

export const createHttpServiceFake = (): HttpFakeConfig => {
  const axios = Axios.create();
  const httpMock = new AxiosMockAdapter(axios);

  return {
    httpMock,
    httpService: new HttpService(axios),
  };
};

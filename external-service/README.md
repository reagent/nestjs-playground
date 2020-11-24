# External Services with Nest.js

This repository is an example of integrating external HTTP services with your
Nest.js application and how to properly test those components at different
layers.

To demonstrate HTTP connectivity, it relies on the [Postman Echo][1] service to
simply echo back any GET requests it receives.

## Setup

Since there's no persistence layer required, installation and startup is simple:

```
$ yarn && yarn start
```

Making a GET request with [cURL][2] will echo back the parameters in the query
string provided:

```
$ curl -s "http://localhost:3000/?key=value" | python -m json.tool
{
    "args": {
        "key": "value"
    },
    "headers": {
        "accept": "application/json, text/plain, */*",
        "host": "postman-echo.com",
        "user-agent": "axios/0.21.0",
        "x-amzn-trace-id": "Root=1-5fbe7898-288d4d534867c48479b7e115",
        "x-forwarded-port": "443",
        "x-forwarded-proto": "https"
    },
    "url": "https://postman-echo.com/get?key=value"
}
```

_(Check out [jq][3] for an improved alternative for formatting response output)_

## Running Tests

This repository contains both isolated and end-to-end tests for the application,
run them with:

```
$ yarn test && yarn test:e2e
```

## Project Structure

```
.
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── config.ts
│   ├── echo.client.spec.ts
│   ├── echo.client.ts
│   ├── main.ts
│   └── types.ts
└── test
    ├── app.e2e-spec.ts
    ├── jest-e2e.json
    └── support
        ├── echo-client.fake.ts
        └── http-service.fake.ts
```

## Key Components

### Implementation

- `echo.client.ts` - Client wrapper for connecting to the Postman Echo
  service
- `app.controller.ts` - Main controller that exposes the single route of the
  application
- `types.ts` - Types used for external requests and the interface definition
  for injecting the proper client service instance

### Testing

- `http-service.fake.ts` - Helper to create a fake [`HttpService`][4] instance
  that relies on the [`AxiosMockAdapter`][5] adapter instance for [`Axios`][6].
  This allows mocking out low-level HTTP interactions
- `echo.client.spec.ts` - Isolated tests for the `EchoClient` that rely on
  the `HttpService` fake to test behavior
- `echo-client.fake.ts` - A fake `EchoClient` instance that can be
  used when performing end-to-end tests. It adheres to the common interface
  (defined in `types.ts`) and provides a helper method for returning canned
  responses
- `app.e2e-spec.ts` - End-to-end tests of the single exposed endpoint that
  disallow external HTTP connections and instead swap in the fake client to
  provide a full testing spike through the system

[1]: https://docs.postman-echo.com/
[2]: https://curl.se/
[3]: https://stedolan.github.io/jq/
[4]: https://docs.nestjs.com/techniques/http-module
[5]: https://www.npmjs.com/package/axios-mock-adapter
[6]: https://www.npmjs.com/package/axios

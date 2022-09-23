---
title: 'Http Polling Mode'
sidebar_label: 'Http Polling Mode'
id: http-mode
tags:
  - web
  - frontend
  - ui
  - http mode
  - polling
---

If the target environment does not support [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) the client can be configured to operate in *http polling mode*.


This is done by setting a few **environment variables**:

- `FORCE_HTTP` needs to be set to `true` to enable the feature.
- `HTTP_CONFIG_PATH` can be set to to a *file path* pointing to a file which will contain the configuration options in json format.

The configuration file itself will look something like this:

```
{
  "POLLING_MAP": {
    "EVENT_AMEND_USER": {
      "TEMP_FREQUENCY": 400,
      "AMOUNT_OF_POLLS": 5,
      "QUERIES": [
        "ALL_USERS"
      ]
    }
  },
  "POLLING_INTERVAL_MAP": {
    "ALL_TRADES": 2000,
    "ALL_USERS": 3000,
    "ALL_PROCESSES_STATUS": 5000
  },
  "POLLING_FREQUENCY": 4000
}
```

- `POLLING_FREQUENCY` is the default polling frequency for everything not explicitly set.
- `POLLING_INTERVAL_MAP` allows us to set custom polling frequencies for different server resources, the keys of the map need to be valid resource names on the server and the values need to be positive integers (number of milliseconds).
- `POLLING_MAP` is slightly more complex, it's used to accelerate the polling frequency temporarily for a set of queries each time specific events occur. The keys need to be valid `events` on the server and the values are maps themselves containing 3 key-value pairs:
    - `TEMP_FREQUENCY`: temporary accelerated frequency
    - `AMOUNT_OF_POLLS`: number of polls using the `TEMP_FREQUENCY`
    - `QUERIES`: the set of queries which will be affected


:::tip
During development you can use [cross-env](https://www.npmjs.com/package/cross-env) to pass environment variables to your scripts.

In your package.json:

```
"config": {
  ...,
  "HTTP_CONFIG_PATH": "./http.config.json"
},
"scripts": {
  ...,
  dev:webpack": "cross-env NODE_ENV=development API_HOST=some-host HTTP_CONFIG_PATH=$npm_package_config_HTTP_CONFIG_PATH webpack serve --open"
}
```
:::
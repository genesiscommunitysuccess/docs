---
title: 'Front-end Reporting'
sidebar_label: 'Front-end reporting'
id: front-end-reporting
tags:
  - reporting
  - frontend
  - ui
  - web
  - micro frontends
---

import Reporting from '../../resource/reporting_mf.md'

<Reporting />

## Set-up

### Server configuration

To enable the report micro-frontend you need to configure the reporting module on the server.
The required configuration is described in the [server module](../../03_server-modules/10_integration/11_data-reporting.md).

### Front-end configuration

To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-reporting` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again.


```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-reporting": "latest"
  },
  ...
}
```

- Import the module and configure the route in your routes **config.ts** file.

**Synchronous example**

```javascript
// Import
import {Reporting} from '@genesislcap/foundation-reporting';

// Routes configure
public configure() {
  ...
  this.routes.map(
    ...
    {path: 'reporting', element: Reporting, title: 'Reporting', name: 'reporting'},
    ...
  );
}
```

**Asynchronous example**

```javascript
// Routes async configure
public async configure() {
  ...
  this.routes.map(
    ...
    {path: 'reporting', element: (await import('@genesislcap/foundation-reporting')).Reporting, title: 'Reporting', name: 'reporting'},
    ...
  );
}
```

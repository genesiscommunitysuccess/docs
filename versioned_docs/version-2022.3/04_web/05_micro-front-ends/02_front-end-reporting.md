---
title: 'Micro-front-ends - Reporting'
sidebar_label: 'Front-end reporting'
id: front-end-reporting
keywords: [web, frontend, ui, micro-front-ends, reporting]
tags:
  - web
  - frontend
  - ui
  - micro-front-ends
  - reporting
---

import Reporting from '../../resource/reporting_mf.md'

<Reporting />

## Set-up

### Server configuration

To enable the Report micro-front-end, you need to configure the Reporting module on the server.
The required configuration is described in the [Server documentation](docs/03_server/10_integration/11_data-reporting.md).

### Front-end configuration

To enable this micro-front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-reporting` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. There is more information on this in the [package.json basics](../../../web/basics/package-json-basics/) page.

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

```javascript {9}
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

```javascript {9}
// Import
import {Reporting} from '@genesislcap/foundation-reporting';

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

:::info
If there are no reports in the database, you will see an error on the web page saying there are no reports to load  - this is expected behaviour.
:::

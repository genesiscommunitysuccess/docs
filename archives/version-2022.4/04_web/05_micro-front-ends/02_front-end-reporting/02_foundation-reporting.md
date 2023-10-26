---
title: 'Foundation Reporting'
sidebar_label: 'Foundation Reporting'
id: foundation-reporting
keywords: [web, frontend, ui, micro-front-ends, reporting]
tags:
  - web
  - frontend
  - ui
  - micro-front-ends
  - reporting
---

# Micro front-end Reporting

The Reporting micro front-end enables your application's users to create report specifications, run them, or save them for later use.

From the GUI, users can:

- select columns from existing data sources
- save the report with a name and retrieve it for future use
- apply ad hoc filtering to a report
- export the report results to .csv  format

The micro front-end has a GUI that walks the user through generating a report.

![Example showing creating a new report](./docs/img/foundation-reporting_create-report.png)

Once the report has been created, it can be viewed in the GUI. It can also be exported to a `.csv` file.

![Example showing the list of all generated reports](./docs/img/foundation-reporting_view-report.png)

All the generated reports are stored for retrieval later. The report configuration is saved and the report updated when the user runs the report again.

![Example showing the list of all generated reports](./docs/img/foundation-reporting_show-reports.png)

## Set-up

### Server configuration

To enable the Report micro front-end, you need to configure the Reporting module on the server. This is covered in our page on [server reporting](../../../../server/integration/server-reporting/).

### Front-end configuration

To enable this micro front-end in your application, follow the steps below.

1. Add `@genesislcap/foundation-reporting` as a dependency in your **package.json** file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. There is more information on this in the [package.json basics](../../../basics/package-json-basics/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-reporting": "latest"
  },
  ...
}
```

2.  Import the module and configure the route in your routes **config.ts** file.

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

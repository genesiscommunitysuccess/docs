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

The Reporting component enables your users to create report specifications, run them, or save them for later use.

From the GUI, users can:

- select columns from existing data sources
- save the report with a name and retrieve it for future use
- apply ad hoc filtering to a report
- export the report results to .csv  format



## Server configuration

To enable this component on the server, pull in the [reporting-distribution-5.6.1-bin.zip](https://genesisglobal.jfrog.io/ui/repos/tree/General/libs-release-local%2Fglobal%2Fgenesis%2Freporting-distribution%2F5.6.1%2Freporting-distribution-5.6.1-bin.zip) from Artifactory, and `unzip` it alongside genesis and auth modules in the standard genesis deployment server directory.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on. In most cases, you will have already set up queries in your [Data Server](/server-modules/data-server/basics/) to provide the data, but you can add new sources by creating new queries in your _application_**-dataserver.kts**.

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)

## Front-end configuration

To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-reporting` as a dependency in your *package.json* file.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-reporting": "1.0.1-alpha-7ea7de2.0"
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

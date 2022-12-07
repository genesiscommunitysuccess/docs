---
title: 'Sever reporting'
sidebar_label: 'Server reporting'
id: server-reporting
tags:
  - reporting
  - server
  - micro frontends
---

import Reporting from '../../resource/reporting_mf.md'

<Reporting />

## Set-up

### Front-end configuration

See the web section of the documentation to [see the micro front-end documentation](../../../web/micro-front-ends/front-end-reporting).

## Server configuration

To enable this component on the server, pull in the [reporting-distribution-6.1.0-bin.zip](https://genesisglobal.jfrog.io/ui/native/libs-release-local/global/genesis/reporting-distribution/6.1.0/reporting-distribution-6.1.0-bin.zip) from Artifactory, and `unzip` it alongside genesis and auth modules in the standard genesis deployment server directory.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on. In most cases, you will have already set up queries in your [Data Server](../../../server/data-server/basics/) to provide the data, but you can add new sources by creating new queries in your _application_**-dataserver.kts**.

eg: making two dataserver queries available to the reporting server
```bash
SendIt -t REPORT_DATASOURCES.csv
```

using an example file `REPORT_DATASOURCES.csv`
```csv
DATASOURCE_NAME,DATASOURCE_TYPE
ALL_TRADES,DATASERVER
ALL_POSITIONS,DATASERVER
```

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)


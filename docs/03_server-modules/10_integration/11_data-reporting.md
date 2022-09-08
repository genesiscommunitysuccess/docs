---
title: 'Sever Reporting'
sidebar_label: 'Server Reporting'
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

See the web section of the documentation to [see the micro-frontend documentation](../../04_front-end/05_micro-front-ends/02_front-end-reporting.md).

## Server configuration

To enable this component on the server, pull in the [reporting-distribution-5.6.1-bin.zip](https://genesisglobal.jfrog.io/ui/repos/tree/General/libs-release-local%2Fglobal%2Fgenesis%2Freporting-distribution%2F5.6.1%2Freporting-distribution-5.6.1-bin.zip) from Artifactory, and `unzip` it alongside genesis and auth modules in the standard genesis deployment server directory.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on. In most cases, you will have already set up queries in your [Data Server](/server-modules/data-server/basics/) to provide the data, but you can add new sources by creating new queries in your _application_**-dataserver.kts**.

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)


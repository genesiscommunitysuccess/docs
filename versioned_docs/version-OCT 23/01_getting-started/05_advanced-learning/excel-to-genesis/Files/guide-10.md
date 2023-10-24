---
id: guide-10
sidebar_label: 'The service definitions file'
sidebar_position: 100
title: 'The service definitions file'
---

This file shows the service definitions that have been defined in the application's service definitions file(_application-name_-**service-definitions.xml**). Each `service` tag defines the host, name and port. This file has been generated automatically by `genx`.


```xml
<configuration>
  <service host="localhost" name="CASH_DATASERVER" port="10000"/>
  <service host="localhost" name="CASH_REQUEST_SERVER" port="10001"/>
  <service host="localhost" name="CASH_EVENT_HANDLER" port="10002"/>
</configuration>
```
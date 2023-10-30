---
title: 'Open API'
sidebar_label: 'Open API'
id: open-api
keywords: [server, integration, open api, introduction]
tags:
  - server
  - integration
  - open api
  - introduction
---

:::important

Open API support was introduced in version 7.0 of the Genesis platform.

:::

The Genesis low-code platform supports the use of [Open API](https://swagger.io/specification/) in order to integrate with external systems. 

Genesis makes this easy to configure and set up, and an Open API specification is generated for the following resources:

* [Request Server](../../../server/request-server/introduction/)
  * The specification is generated for every GPAL request server.
* [Event Handler](../../../server/event-handler/introduction/)
  * The specification is generated for each GPAL event handler.
* [Custom Endpoints](../custom-endpoints/introduction/)
  * The specification is generated for each GPAL Custom Endpoints.
  * The standard specification can be augmented using the `openapi { ... }` DSL, [see here for details](../custom-endpoints/advanced/#openapi).

Internally, the framework will use metadata system to generate JSON schemas for input and return objects in the Open 
API spec. For more details on this please see [here](../../network-messages/type-safe-messages) and 
[here](../../network-messages/metadata-annotations).

## Accessing Open API specification

:::important

Genesis Open API supports Open API version 3.1.

:::

The Open API specification is generated at runtime and is available at the following endpoints:

Full specification: 
`https://{server-host}/gwf/open-api/spec/`

Service specific specification: 
`https://{server-host}/gwf/open-api/spec/{service-name}`

You can verify the specification by copying the contents into [Swagger Editor](https://editor-next.swagger.io/)

For an example specification, [please see here](pathname:///file/openapi-sample.yaml).

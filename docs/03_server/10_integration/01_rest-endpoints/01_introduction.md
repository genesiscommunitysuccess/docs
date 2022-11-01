---
title: 'REST endpoints - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, REST endpoints, introduction]
tags:
  - server
  - integration
  - REST endpoints
  - introduction
---

[Introduction](/server/integration/rest-endpoints/introduction/) | [Where to define](/server/integration/rest-endpoints/where-to-define) | [Basics](/server/integration/rest-endpoints/basics/) | [Advanced](/server/integration/rest-endpoints/advanced/) | [Configuring runtime](/server/integration/rest-endpoints/configuring-runtime/) | [Testing](/server/integration/rest-endpoints/testing/)

The Genesis low-code platform automatically exposes all configured resources as REST endpoints via the [Genesis Router](/server/configuring-runtime/genesis-router/). Unless configured otherwise, all requests require a valid `SESSION_AUTH_TOKEN` HTTP header. A `SESSION_AUTH_TOKEN` is retrieved after successful user authentication.

The `Content-Type` of all HTTP request/responses is `application/json`.

Here, we provide a list of the endpoints for each resource:
* [Authentication (log in)](/server/integration/rest-endpoints/basics/#authentication)
* [Data Servers](/server/integration/rest-endpoints/basics/#data-servers)
* [Request Servers](/server/integration/rest-endpoints/basics/#request-server)
* [Event Handlers](/server/integration/rest-endpoints/basics/#event-handler)

As well as these resources, there are also endpoints available for:
* [Authentication (refresh and log out)](/server/integration/rest-endpoints/advanced/#authentication)
* [Metadata](/server/integration/rest-endpoints/advanced/#metadata)

For more information on exposing endpoints for resources not listed above, see [Custom Endpoints](/server/integration/custom-endpoints/introduction/).

---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server-modules/integration/rest-endpoints/introduction/) | [Where to define](/server-modules/integration/rest-endpoints/where-to-define) | [Basics](/server-modules/integration/rest-endpoints/basics/) | [Advanced](/server-modules/integration/rest-endpoints/advanced/) | [Configuring runtime](/server-modules/integration/rest-endpoints/configuring-runtime/) | [Testing](/server-modules/integration/rest-endpoints/testing/)

The Genesis low-code platform automatically exposes all configured resources as REST endpoints via the [Genesis Router](/server-modules/configuring-runtime/genesis-router/). Unless configured otherwise, all requests require a valid `SESSION_AUTH_TOKEN` HTTP header. A `SESSION_AUTH_TOKEN` is retrieved after successful user Authentication.

The `Content-Type` of all HTTP request/responses are `application/json`

Here, we provide a list of the endpoints for each resource:
* [Authentication (log in)](/server-modules/integration/rest-endpoints/basics/#authentication)
* [Data Servers](/server-modules/integration/rest-endpoints/basics/#data-servers)
* [Request Servers](/server-modules/integration/rest-endpoints/basics/#request-server)
* [Event Handlers](/server-modules/integration/rest-endpoints/basics/#event-handler)

As well as these resources, there are also endpoints available for:
* [Authentication (refresh and log out)](/server-modules/integration/rest-endpoints/advanced/#authentication)
* [Metadata](/server-modules/integration/rest-endpoints/advanced/#metadata)

For more information on exposing endpoints for resources not listed above, see [Custom Endpoints](/server-modules/integration/custom-endpoints/introduction/).
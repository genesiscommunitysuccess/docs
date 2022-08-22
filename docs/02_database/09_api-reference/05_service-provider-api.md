---
title: 'Service Provider API'
sidebar_label: 'Service Provider API'
id: service-provider-api
---

Service detail provider
=======================

In this page, we look at details of the functions that enable you to interact with the Genesis services that can be specified in the [service-definition.xml](/getting-started/learn-the-basics/key-system-files/genesis-system-definitions/) file.

Functions[​](/database/api-reference/service-provider-api/#functionsdirect-link-to-heading)
------------------------------------------------------------------------------------------------------------------------------------

| Name | Signature | Description |
| --- | --- | --- |
| getServiceDetails | `@NotNull ServiceDetails getServiceDetails(String processName) throws GenesisConfigurationException` | Get service details for a given process name. |
| getServiceMap | `Map<String, ServiceDetails> getServiceMap() throws GenesisConfigurationException` | Get services map with: key = serviceName, value = details |
| getServices | `List<ServiceDetails> getServices() throws GenesisConfigurationException` | Get list of services. |
| getStartedServices | `List<ServiceDetails> getStartedServices() throws GenesisConfigurationException` | Get list of started services. |
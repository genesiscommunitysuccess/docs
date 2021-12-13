---
id: service-detail-provider
title: Service detail provider
sidebar_label: Service provider API
sidebar_position: 20
---

In this page, we look at details of the functions that enable you to interact with the Genesis services specified that can be specified in the **service-definition.xml** file.

## Functions

| Name | Signature | Description |
|---|---|---|
| getServiceDetails | `@NotNull ServiceDetails getServiceDetails(String processName) throws GenesisConfigurationException` | Get service details for a given process name. |
| getServiceMap | `Map<String, ServiceDetails> getServiceMap() throws GenesisConfigurationException` | Get services map with: key = serviceName, value = details |
| getServices | `List<ServiceDetails> getServices() throws GenesisConfigurationException` | Get list of services. |
| getStartedServices | `List<ServiceDetails> getStartedServices() throws GenesisConfigurationException` | Get list of started services. |
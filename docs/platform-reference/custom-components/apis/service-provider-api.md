---
id: service-detail-provider
title: Service detail provider
sidebar_label: Service provider API
sidebar_position: 2
---

Provides details of Genesis services specified in service-definition.xml file

### Functions:

| Name | Signature | Description |
|---|---|---|
| getServiceDetails | `@NotNull ServiceDetails getServiceDetails(String processName) throws GenesisConfigurationException` | Get service details for a given process name. |
| getServiceMap | `Map<String, ServiceDetails> getServiceMap() throws GenesisConfigurationException` | Get services map with: key = serviceName, value = details |
| getServices | `List<ServiceDetails> getServices() throws GenesisConfigurationException` | Get list of services |
| getStartedServices | `List<ServiceDetails> getStartedServices() throws GenesisConfigurationException` | Get list of started services |
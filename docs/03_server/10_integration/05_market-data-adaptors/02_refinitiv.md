---
title: 'Market data adaptors - Refinitiv'
sidebar_label: 'Refinitiv'
id: refinitiv
keywords: [server, integration, market data adaptors, refinitiv]
tags:
  - server
  - integration
  - market data adaptors
  - refinitiv
---


Installation[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/refinitiv/refinitiv-config/#installation "Direct link to heading")
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

To install the Refinitiv market-data adaptor, download the elektron-distribution package from the Genesis repository.

Configuration[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/refinitiv/refinitiv-config/#configuration "Direct link to heading")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The Refinitiv adaptor relies on a `connection` block within the adaptor's xml file to define the connectivity information that connects to the remote Refinitiv provider (for example, ADH).

```xml
<connection>    
    <connectionType>RSSL</connectionType>    
    <port>14002</port>    
    <host>localhost</host>    
    <userName>genesis</userName>    
    <service>ELEKTRON_DD</service>    
    <logEnabled>0</logEnabled>
</connection>
```

The `ricFormat` section enables you to modify instrument codes before the subscription is sent to the remote provider.

```xml
<ricFormat>    
    <![CDATA[ "/" + ips.getString('INSTRUMENT_CODE') + ".L" ]]>
</ricFormat>
```

`ips` refers to the alias given to the `INSTRUMENT_PRICE_SUBSCRIPTION` table. All tables are referenced by alias in this function.

Field formats[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/refinitiv/refinitiv-config/#field-formats "Direct link to heading")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The data received from Refinitiv will be in the format of a map with string keys. The keys are determined by the RDDM dictionary file used to configure the remote provider, which the client will query at runtime.

Please check your provider configuration in order to ensure you are reading the correct field keys in your transformation code. These are specified in `fields` or `hftFields`.
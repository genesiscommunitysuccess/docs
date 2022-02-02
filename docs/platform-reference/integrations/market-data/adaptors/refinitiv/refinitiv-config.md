---
id: refinitiv-config
title: Refinitiv Adaptor Configuration
sidebar_label: Refinitiv Adaptor Configuration
sidebar_position: 10
---

## Installation
In order to install and start working with the Refinitiv market data adaptor, please download the elektron-distribution package from the Genesis repository.

## Configuration
The Refinitiv adaptor relies on a `connection` block within the adaptor xml file to define the connectivity information to connect to the remote Refinitiv provider (for example, ADH).

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

In addition, it also adds a `ricFormat` section to the subscription definition that allows the modification of instrument codes before the subscription is sent to the remote provider.
```xml
<ricFormat>
	<![CDATA[ "/" + ips.getString('INSTRUMENT_CODE') + ".L" ]]>
</ricFormat>
```
`ips` in this case refers to the alias given to the INSTRUMENT_PRICE_SUBSCRIPTION table. All tables are referenceable by alias in this function.

## Field formats
The data received from Refinitiv will be in the format of a map with string keys. The keys are determined by the RDDM dictionary file used to configure the remote provider, which the client will query at runtime.

Please check your provider configuration in order to ensure you are reading the correct field keys in your transformation code (specified in `fields` or `hftFields`)
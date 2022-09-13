---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Introduction](/server-modules/integration/apache-camel/introduction/)  | [Basics](/server-modules/integration/apache-camel/basics) | [Advanced](/server-modules/integration/apache-camel/advanced) | [Examples](/server-modules/integration/apache-camel/examples) | [Configuring runtime](/server-modules/integration/apache-camel/configuring-runtime) | [Testing](/server-modules/integration/apache-camel/testing)

### System definitions
It is vital to ensure that any system definition variables that are used by the Camel definition are properly defined in your _application-name_**-system-definition.kts** file.

### Dependencies
The Genesis low-code platform only includes the `camel-core` dependency. You will want to declare additional dependencies to make best use of the different available Camel components.

To do so, simply create a new local module declaring the Camel dependencies, and add this module to the classpath of the Camel process configuration in your _application-name_**-processes.xml** file.

The process definition may look similar to the following:

```xml
  <process name="POSITION_CAMEL">
    <groupId>POSITION</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-camel</module>
    <package>global.genesis.pal.camel</package>
    <script>position-camel.kts</script>
    <description>Camel integrations</description>
    <classpath>position-messages*,position-camel*,position-camel-libs*.jar</classpath>
    <language>pal</language>
  </process>
```

Where the position-camel-libs module may have similar dependencies to the following:

<Tabs defaultValue="maven" values={[{ label: 'Gradle', value: 'gradle', }, { label: 'Maven', value: 'maven', }]}>
<TabItem value="gradle">

```kotlin
    api("org.apache.camel:camel-mail:3.14.2")
    api("javax.mail:javax.mail-api:1.6.2")
```

</TabItem>
<TabItem value="maven">

```xml
<dependency>
	<groupId>org.apache.camel</groupId>
	<artifactId>camel-mail</artifactId>
	<version>3.14.2</version>
</dependency>
<dependency>
	<groupId>javax.mail</groupId>
	<artifactId>javax.mail-api</artifactId>
	<version>1.6.2</version>
</dependency>
```

</TabItem>
</Tabs>

:::note
Your position-camel-libs module should be a dependency in your position-distribution module to ensure a position-camel-libs jar file is included in the Genesis application distribution
:::
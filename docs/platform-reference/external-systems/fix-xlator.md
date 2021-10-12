---
title: FIX Xlator
sidebar_label: fix-xlator
sidebar_position: 3
id: fix-xlator
---

The GPAL FIX Xlator is a plugin for the streamer and streamer client, to bring in type safe handling of FIX messages.

### Enabling

To enable the plugin is the same for both the streamer and streamer client, at the top of the file, this code block should be added:
```kotlin
plugins {
    plugin(FixXlatorPlugin)
}

fixConfiguration {
    version = fix50ref
}
```
The `plugins` tag enables the plugin and the `fixConfiguration` tag selects the version to use. 

This will require a dependency on the class path generated with the using the fix-codegen-plugin.

The plugin will enable a host of extension functions to

### Streamer

Enabling the plugin in a streamer definition enables the `fixStream` definition.

Fix Streams
Fix Streams are enhanced stream definitions that come with a few useful defaults, enhanced fixed handling and automatic conversion to GenesisSet.

Usage
There are three separate types of fixStream configurations:

```kotlin
fixStream("FIX_IN") 

fixStream<ExecutionReport>("EXECUTION_REPORT")

fixStream("CUSTOM", CUSTOM_FIX.FIX_INDEX, CUSTOM_FIX.DATA, ExecutionReport::class)
```


| Name | Source Table | Stream Index | Fix Column | Stream Type |
| --- | --- | --- | --- | --- |
| FIX_IN | FIX_IN | BY_RX_SEQUENCE | FIX_DATA | Message |
| EXECUTION_REPORT | FIX_IN | BY_RX_SEQUENCE | FIX_DATA | ExecutionReport |
| CUSTOM | CUSTOM_FIX | FIX_INDEX | DATA | ExecutionReport |

When using the FIX_IN table, the appropriate index and column are selected automatically.

When specifying a message type, this will become a filter on type, so the "EXECUTION_REPORT"

stream will only stream execution reports. Also, the fields can now be accessed in a typesafe

manner:

```kotlin
fixStream<ExecutionReport>("EXECUTION_REPORT_VODL") {
    where { report ->
        report.lastMkt() == "VODL"
    }
}
```

### Streamer Client

#### Message extension functions

`toGenesisSet`

Converts a fix message to a GenesisSet. Optional parameters, list of fields:

```kotlin
val set = message.toGenesisSet()
```

`set`

This is an operator function that allows you to set message fields straight from a GenesisSet

or a value

```kotlin
executionReport.set(executionReport.yield, set)
// or
executionReport[executionReport.yield] = set
// or
executionReport[executionReport.yield] = 1.2
```

Please note that this function will only accept joda DateTime values for any of the

quickfix date types. The value will be converted appropriately internally.

`get`

This function will get any field from a quick fix message:

```kotlin
val yield = executionReport[executionReport.yield]
```

The return values are always nullable. Any quick fix date type will automatically be

converted to a joda DateTime value before being returned.

#### GenesisSet extension functions

`set`

This function sets the field value in the GenesisSet

Optionally, the field name can be specified, otherwise the field name

will be automatically converted

```kotlin
genesiSet.set(executionReport.yield)

genesiSet.set("REPORTED_YIELD", executionReport.yield)
```

`setWithDefault`

This function is similar, but allows a default value to be specified:

```kotlin
genesiSet.setWithDefault(executionReport.yield, 1.0)

genesiSet.setWithDefault("REPORTED_YIELD", executionReport.yield, 1.0)

genesiSet.setWithDefault("REPORTED_YIELD", executionReport.yield, executionReport.otherYield)
```

#### Field extension functions

`invoke`

This operator function simplifies the syntax for getting and setting field values. It will

return null if the field is not set.

```kotlin
val yield = executionReport.yield()
executionReport.yield(1.0)
```

### FIX code generation plugin

Fix code generation plugin is used to generate Java sources from QuickFIX XML dictionary

Create a new maven module called {applicationName}-messages and add plugin dependency like below in module pom file

```xml
<plugins>
    <plugin>
        <groupId>org.quickfixj</groupId>
        <artifactId>quickfixj-codegenerator</artifactId>
        <version>${quickfix.version}</version>

        <executions>
            <execution>
                <phase>generate-sources</phase>
                <goals>
                    <goal>generate</goal>
                </goals>
                <configuration>
                    <dictFile>${project.basedir}/src/main/resources/specs/${dictionary-file}</dictFile>
                    <decimal>true</decimal>
                    <orderedFields>true</orderedFields>
                    <packaging>global.genesis.quickfix.${fix-version}</packaging>
                    <fieldPackage>global.genesis.quickfix.${fix-version}.field</fieldPackage>
                </configuration>
            </execution>
        </executions>
    </plugin>
    <plugin>
        <groupId>${project.parent.groupId}</groupId>
        <artifactId>fix-codegen-plugin</artifactId>
        <version>${fix.version}</version>

        <executions>
            <execution>
                <phase>generate-sources</phase>
                <goals>
                    <goal>generateFix</goal>
                </goals>
                <configuration>
                    <dictionaryFile>${project.basedir}/src/main/resources/specs/${dictionary-file}</dictionaryFile>
                    <fixVersion>${fix-version}</fixVersion>
                    <packageName>global.genesis.quickfix.${fix-version}</packageName>
                </configuration>
            </execution>
        </executions>
    </plugin>
</plugins>
```
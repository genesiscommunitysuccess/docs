---
title: 'API reference - system definition API'
sidebar_label: 'System definition API'
id: system-definition-api
keywords: [server, api, reference, system definition, configuration]
tags:
    - server
    - api
    - reference
    - system definition
    - configuration
---



The [system-definition](../../../getting-started/learn-the-basics/key-system-files/genesis-system-definitions/) file is the basis of all configurations. In this page, we describe the different functions available to get properties specified in the **system-definition.kts** file. Default methods have implementations to provide default values for each property.

Most of the functions are to get or set a particular property.

If you add any other property whose getter or setter function is not available, use the functions `get` or `getItem`.

You can access system definition properties in two ways:

-   using existing APIs
-   using @Named Genesis annotation

## Using existing APIs[​](../../../server/api-reference/system-definition-api/#using-existing-apisdirect-link-to-heading)
-----------------------------------------------------------------------------------------------------------------------------------------------

| name | signature |
| --- | --- |
| availableProperties | `@NotNull default Set<String> availableProperties()` |
| determineEnvironment | `@NotNull default String determineEnvironment()` |
| get | `@NotNull default Optional<String> get(String key)` |
| getAeronArchiveEnabledFlag | `default Optional<Boolean> getAeronArchiveEnabledFlag()` |
| getAeronIpRange | `default Optional<String> getAeronIpRange()` |
| getAeronServicePort | `default Optional<Integer> getAeronServicePort()` |
| getChronicleMapAverageKeySizeBytes | `default Optional<String> getChronicleMapAverageKeySizeBytes()` |
| getChronicleMapAverageValueSizeBytes | `default Optional<String> getChronicleMapAverageValueSizeBytes()` |
| getChronicleMapEntriesCount | `default Optional<String> getChronicleMapEntriesCount()` |
| getDaemonServerPort | `default Optional<String> getDaemonServerPort()` |
| getDatabaseHostname | `default Optional<String> getDatabaseHostname()` |
| getDatabasePort | `default Optional<String> getDatabasePort()` |
| getDbNamespace | `default Optional<String> getDbNamespace()` |
| getDefaultCertificateLocation | `default Optional<String> getDefaultCertificateLocation()` |
| getDefaultKeystoreLocation | `default Optional<String> getDefaultKeystoreLocation()` |
| getDefaultKeystorePassword | `default Optional<String> getDefaultKeystorePassword()` |
| getHost | `default GenesisHost getHost(String hostName)` |
| getHosts | `List<GenesisHost> getHosts()` |
| getItem | `@Nullable Object getItem(String key)` |
| getLogFramework | `default Optional<String> getLogFramework()` |
| getLogFrameworkConfig | `default Optional<String> getLogFrameworkConfig()` |
| getReqRepTimeout | `default Optional<String> getReqRepTimeout()` |
| getValueOrDefault | `@NotNull default String getValueOrDefault(String key, @NotNull String defaultValue)` |
| getZeroMQInboundPort | `default Integer getZeroMQInboundPort()` |
| getZeroMQOutboundPort | `default Integer getZeroMQOutboundPort()` |
| getZeroMQProxyModeEnabled | `default Boolean getZeroMQProxyModeEnabled()` |
| getZeroMQUnicastRelayEnabled | `default Boolean getZeroMQUnicastRelayEnabled()` |
| isAuthDisabled | `default boolean isAuthDisabled()` |
| isClusteringEnabled | `default boolean isClusteringEnabled()` |
| isEncrypted | `default boolean isEncrypted(String key)` |
| isMetricsEnabled | `boolean isMetricsEnabled()` |
| parseProperty | `static <T, R> Optional<R> parseProperty(Supplier<Optional<T>> property, Predicate<? super T> canBeTransformed, Function<? super T, ? extends R> transformer)` |
| parseStringProperty | `static <R> Optional<R> parseStringProperty(Supplier<Optional<String>> property, Function<? super String, ? extends R> transformer)` |

## Using @Named genesis annotation[​](../../../server/api-reference/system-definition-api/#using-named-genesis-annotationdirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Injectable properties from system definition
Here is an example of a **genesis-system-definition.kts** file:

```kotlin
systemDefinition {
    global {
        item(name = "CONFIG_FILE_NAME", value = "/data/")
        // other params omitted for simplicity
    }
}
```
Here is an example of a system definition property being referenced in a Java file:

```java
@Inject
public RequestReplyDefinitionReader(RxDb db,
                                    @Named("CONFIG_FILE_NAME") String configFileName) throws GenesisConfigurationException {
    this(db.getDictionary(), configFileName);
}
```
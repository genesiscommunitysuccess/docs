---
id: system-def-api
title: System definition API
sidebar_label: System definition API
sidebar_position: 1

---

The system-definition file is the base of all configurations. Explained below are the different functions available to get properties specified in the system-definition.kts file.
Default methods have implementation to provide default values for property. For more information, follow this [link](/platform-reference/essential-information/system_definitions-latest) 

Most of the functions are to get/set particular property. 

Use functions `get` or `getItem` if you add any other property whose getter/setter function is not available 

You can access system definition properties in two ways:

## Using existing APIs

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

## Using @Named genesis annotation
Follow this [link](/platform-reference/custom-components/custom-components/#injectable-properties-from-system-definition) for example
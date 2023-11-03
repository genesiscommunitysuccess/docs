---
title: 'Release notes - documentation version OCT 23'
sidebar_label: 'Current (OCT 23)'
sidebar_position: 3
id: current
keywords: [operations, release notes, OCT 2023]
tags:
- operations
- release notes
- OCT 2023
---

## Release notes
This is version OCT 23 of the documentation for the Genesis low-code platform.

For this release of the documentation, we are updating dynamically.

This release of the documentation covers the following versions of the platform software:

| part of stack | version       | 
|---------------|---------------|
| server        | 7.0.0 **+**   |  
| web           | 14.92.5 **+** |   

As soon as changes are made to the platform, this version of the documentation will be updated to show the changes.

Release date: 24 October, 2023

## Foundation UI

Foundation UI has a programme of regular continual releases. These are documented along with their source code on [github](https://github.com/genesislcap/foundation-ui/releases).

## Genesis Server Framework (GSF)

GSF release notes are added to this area immediately following each software release. The most release is at the top.

## Genesis 7.0.1(genesis-server)

### Fixes
- (pal-dataserver): ensure dataserver auth cache is initialised correctly
- (purger): Purger enhancements

## Genesis 6.7.10(genesis-server)

### Features
- (pal-streamerclient): pal-streamerclient: Implement script to dump streamer client cache in JSON format

### Fixes
- (pal-dataserver): ensure dataserver auth cache is initialised correctly
- (purger): Purger enhancements

## Genesis 6.6.25(genesis-server)

### Features
- (pal-streamerclient): pal-streamerclient: Implement script to dump streamer client cache in JSON format

### Fixes
- (pal-dataserver): ensure dataserver auth cache is initialised correctly
- (purger): Purger enhancements

## Genesis 7.0.0(genesis-server)

### Breaking changes
- Removed support for aerospike as a database layer implementation
- Removing Python 2 scripts
- Change all command Nacks to follow new format
- Remove access to AuthCache static methods and make AuthCacheFactory injectable instead
- Rework StandardServiceDetailProvider and DefaultProcessInfoProvider to not rely on static properties and methods
- Upgrade GSF to JUnit5
- Upgrade to FoundationDB 7.1.x
- Upgrade to JDK 17
- Upgrade to Kotlin 1.9.0
- dropwizard to micrometer
- Remove code generation for database table repos by default and provides option to re-enable them
- Remove GenesisDb from GSF

### Features
- (genesis-codegen): extract builder from entity
- (pal-dataserver): Add Fury serialization support and off heap buffer implementation
- (pal-streamerclient): pal-streamerclient: Implement script to dump streamer client cache in JSON format
- (remap): Add skipTableDump Flag
- (router): Add flag to enable websocket compression
- Add support for Open Telemetry tracing and logging context
- Add support for optimistic concurrency
- Add trace logging to rightSummaryCache
- Adding Encoding support for RAW types
- Allow TIMESTAMPS to be searched for using different formats
- Allow encoding of refresh token on EVENT_LOGIN_AUTH nack for MFA workflows
- DbMon: View support on read operations
- Mark public ListenableFuture APIs as deprecated
- Nack messages need to implement common interface called GenesisNackReply
- Rework generateCache tasks to avoid re-generating code
- Upgrade Gradle to version 8.2.1
- Upgrade to Gradle 8.3
- Add an endpoint for the health check port for prometheus format as well as json
- Add sync db interface
- Add timeout to the sql connection to connect connection starvation
- Added -force argument to SendIt script
- Added support for openapi
- Create tasks to copy config files to genesis-home folder
- Create tasks to copy distribution to genesis-home in gradle build folder
- Make GenesisScriptHost non-static and injectable
- New distribution zip plugin impl.
- Support to specify Precision on BIGDECIMAL

### Fixes
- (dataserver): backwardsjoin memory and throughput improvements, and deadlock fix
- (pal-dataserver): ensure calls to "nextRows" in NextRowsStrategy only run a single LMDB transaction in a single [Dispatchers.IO](http://dispatchers.io/) thread
- (pal-dataserver): remove runblocking operations from NextRowsStrategy after reverting changes
- (pal-dataserver): revert coroutine based LMDB stream operation usage inside NextRowsStrategy as it leads to deadlocks
- (pal-streamerclient): Ensure recovery timestamps get set as COMPLETE and not ACKED
- (pal-streamerclient): Fixed race condition where message is marked as complete before it is marked as sent
- (pal-streamerclient): Prevent duplicate DS_LOGON messages when streamer goes down
- (pal-streamerclient): Prevent shutdown deadlock and performance degredation due to metric accumulation
- (views): improve parsing in view script
- Avoid using GenesisScriptConfig in genesisInstall
- Change ENTITY_ID field size so it can be used as a key column with MSSQL
- Console endpoints to start/not start without mandatory sysdef property
- ConsulServiceDiscovery localhost() method now returns value for sysdef item "ServiceAddress"
- Ensure exception in streamer callbacks do not terminate the stream
- Fix DbMon search
- Fix handling in GetNextSequenceNumbers script
- Fix kover report generation
- Fixed XML purger business day calculation
- LocalCommandExecutor to support execution from inside WSL/Ubuntu env
- Logout can also be performed without the user being logged in
- Make logging async by default
- OpenApi generator fails due empty object definition
- Prevent deadlock in DbLayer by not using RxJava computation thread to publish updates from the queue
- Prevent process crash in dynamic rule registration
- RefreshTokenCleanUp script to use USER_SESSION table
- SESSION_ID is propagated in the Logout message
- ScriptAnnotationHandler is unable to load script dependencies when using @file:ScriptModules annotation backport
- SetLogLevelScript.groovy to create an instance of ServiceDetailProvider
- Setting PROCESS_STATUS_MESSAGE to db max size
- TestUtil to use supplied DBHost upon test startup
- UTS H2 using schema has fixed value PUBLIC
- Add blocking annotation on sync db api
- Change entityId concatenation in AuthKeyBuilder and SimpleGenericAuthEvaluator
- Connection pool handling
- Don't attempt to change ENUM fields on tables which arent yet created
- Fix potential deadlock in static initialistion of dao classes
- Generate TemplateOptionsDefault object dynamically from gradle to guarantee we are always using the correct values
- genesisInstall has to be run twice to install sysdef changes from site-specific
- Ignore derived fields when building view indices
- Improve dataserver priming performance and memory profile
- Including builders to be also serialized in the DAO dictionary
- killProcessRestarter is not killing processRestarter process
- Make GenesisDictionary db agnostic until it gets to the StorageEngine
- Reduce data server memory usage
- Returns 400/REQUEST_FAILED when IllegalArgument is captured in the eventhandler layer rather than 500/INTERNAL_ERROR

### Dependency changes
- Revert bump com.lmax:disruptor from 3.4.4 to 4.0.0 in genesis-conventions/genesis-dependencies
- Upgrade debezium from 1.9.3.Final to 2.3.3.Final
- Upgrade to Kotlin 1.9.10
- Bump actions/checkout from 3 to 4
- Bump aeronVersion from 1.41.4 to 1.42.1 in /genesis-conventions/genesis-dependencies
- Bump apachePoi from 5.2.3 to 5.2.4 in /genesis-conventions/genesis-dependencies
- Bump byteBuddyVersion from 1.14.6 to 1.14.7 in /genesis-conventions/genesis-dependencies
- Bump byteBuddyVersion from 1.14.7 to 1.14.8 in /genesis-conventions/genesis-dependencies
- Bump byteBuddyVersion from 1.14.8 to 1.14.9 in /genesis-conventions/genesis-dependencies
- Bump camelVersion from 4.0.0 to 4.0.1 in /genesis-conventions/genesis-dependencies
- Bump camelVersion from 4.0.1 to 4.1.0 in /genesis-conventions/genesis-dependencies
- Bump codahaleVersion from 4.2.19 to 4.2.20 in /genesis-conventions/genesis-dependencies
- Bump com.github.oshi:oshi-core from 6.4.5 to 6.4.6 in /genesis-conventions/genesis-dependencies
- Bump com.github.spullara.mustache.java:compiler from 0.9.10 to 0.9.11 in /genesis-conventions/genesis-dependencies
- Bump com.google.errorprone:error_prone_annotations from 2.21.1 to 2.22.0 in /genesis-conventions/genesis-dependencies
- Bump com.google.guava:guava from 32.1.2-jre to 32.1.3-jre in /genesis-conventions/genesis-dependencies
- Bump com.google.protobuf:protobuf-java from 3.24.1 to 3.24.2 in /genesis-conventions/genesis-dependencies
- Bump com.google.protobuf:protobuf-java from 3.24.2 to 3.24.3 in /genesis-conventions/genesis-dependencies
- Bump com.google.protobuf:protobuf-java from 3.24.3 to 3.24.4 in /genesis-conventions/genesis-dependencies
- Bump com.h2database:h2 from 2.2.220 to 2.2.222 in /genesis-conventions/genesis-dependencies
- Bump com.h2database:h2 from 2.2.222 to 2.2.224 in /genesis-conventions/genesis-dependencies
- Bump com.lmax:disruptor from 3.4.4 to 4.0.0 in /genesis-conventions/genesis-dependencies
- Bump com.microsoft.sqlserver:mssql-jdbc from 12.4.0.jre11-preview to 12.4.1.jre11 in /genesis-conventions/genesis-dependencies
- Bump com.squareup:kotlinpoet from 1.12.0 to 1.14.2 in /genesis-conventions/genesis-dependencies
- Bump commons-io:commons-io from 2.13.0 to 2.14.0 in /genesis-conventions/genesis-dependencies
- Bump commons-net:commons-net from 3.9.0 to 3.10.0 in /genesis-conventions/genesis-dependencies
- Bump debeziumVersion from 2.3.3.Final to 2.3.4.Final in /genesis-conventions/genesis-dependencies
- Bump info.picocli:picocli from 4.7.4 to 4.7.5 in /genesis-conventions/genesis-dependencies
- Bump io.netty:netty-all from 4.1.96.Final to 4.1.97.Final in /genesis-conventions/genesis-dependencies
- Bump io.netty:netty-all from 4.1.97.Final to 4.1.98.Final in /genesis-conventions/genesis-dependencies
- Bump io.netty:netty-all from 4.1.98.Final to 4.1.99.Final in /genesis-conventions/genesis-dependencies
- Bump io.netty:netty-all from 4.1.99.Final to 4.1.100.Final in /genesis-conventions/genesis-dependencies
- Bump io.opentelemetry:opentelemetry-bom from 1.30.1 to 1.31.0 in /genesis-conventions/genesis-dependencies
- Bump io.reactivex.rxjava3:rxjava from 3.1.6 to 3.1.7 in /genesis-conventions/genesis-dependencies
- Bump io.reactivex.rxjava3:rxjava from 3.1.7 to 3.1.8 in /genesis-conventions/genesis-dependencies
- Bump jacksonVersion from 2.14.2 to 2.15.2 in /genesis-conventions/genesis-dependencies
- Bump ktorVersion from 2.3.3 to 2.3.4 in /genesis-conventions/genesis-dependencies
- Bump ktorVersion from 2.3.4 to 2.3.5 in /genesis-conventions/genesis-dependencies
- Bump maven-plugin-api.version from 3.9.4 to 3.9.5 in /genesis-parent/genesis-maven-submodules
- Bump mockitoVersion from 5.4.0 to 5.6.0 in /genesis-conventions/genesis-dependencies by @dependabot in https://github.com/genesislcap/genesis-server/pull/1684
- Bump msgpackVersion from 0.9.3 to 0.9.4 in /genesis-conventions/genesis-dependencies by @dependabot in https://github.com/genesislcap/genesis-server/pull/1365
- Bump msgpackVersion from 0.9.4 to 0.9.6 in /genesis-conventions/genesis-dependencies
- Bump oracleJdbcVersion from 23.2.0.0 to 23.3.0.23.09 in /genesis-conventions/genesis-dependencies
- Bump org.agrona:agrona from 1.19.1 to 1.19.2 in /genesis-conventions/genesis-dependencies
- Bump org.apache.commons:commons-compress from 1.23.0 to 1.24.0 in /genesis-conventions/genesis-dependencies
- Bump org.apache.maven.plugins:maven-enforcer-plugin from 3.4.0 to 3.4.1 in /genesis-parent/genesis-maven-submodules
- Bump org.apache.maven:maven-model from 3.9.4 to 3.9.5 in /genesis-parent/genesis-maven-submodules
- Bump org.checkerframework:checker-qual from 3.37.0 to 3.38.0 in /genesis-conventions/genesis-dependencies
- Bump org.checkerframework:checker-qual from 3.38.0 to 3.39.0 in /genesis-conventions/genesis-dependencies
- Bump org.furyio:fury-core from 0.1.2 to 0.2.0 in /genesis-conventions/genesis-dependencies
- Bump org.zeromq:jeromq from 0.5.3 to 0.5.4 in /genesis-conventions/genesis-dependencies
- Bump slf4jVersion from 2.0.7 to 2.0.9 in /genesis-conventions/genesis-dependencies
- Bump testcontainersVersion from 1.18.3 to 1.19.0 in /genesis-conventions/genesis-dependencies
- Bump testcontainersVersion from 1.19.0 to 1.19.1 in /genesis-conventions/genesis-dependencies
- Upgrade Gradle version to 8.4
- Upgrade camel from 3.21.0 to 4.0.0
- Upgrade to Kotlin coroutines 1.7.3

## Genesis 7.0.0(genesis-symphony)

### Dependency changes
- Upgrade to Kotlin 1.9.10
- Bump com.github.node-gradle.node from 3.1.1 to 7.0.1
- Bump com.jfrog.artifactory from 4.29.0 to 5.1.10
- Bump org.simplejavamail:simple-java-mail from 7.2.1 to 8.3.1

## Genesis 7.0.0(fix-server)

## Breaking changes
- Migrated purger from xml to gpal. Any applications overriding fix-purger.xml in site-specific must move to fix-purger.kts format

### Features
- Configuration of a FIX gateway can now be done through a GPAL script
- Prevent concurrent distributed sessions when using dynamic configuration
- Add fix-test module and move TestFixClient and TestFixServer so clients can use them in tests

### Fixes
- Convert remaining java files to kotlin to ensure inclusion in the jar
- Downgrade log level of message when dyanmic session lookup fails
- Ensure cache entries setting from streamer client is respected in fix xlator plugin
- Ensure database sessions use correct message store
- Ensure exception does not crash process when transaction is terminated
- Ensure session providers are not overwritten when more than one template is specified
- Ensured FIX message utility functions are available in streamer client scripts
- Fixed issue where password salt would default to null resulting in corrupted SHA512 hash
- Fixed the concurrent logon prevention mechanism causing a process crash
- Gateway process is no longer marked as in warning state when individual session is outside schedule
- Remove deadlock in fix outbound flow when using Database message store and make updates sequential
- Change process definition of request server to work point to genesis-request server to avoid clash with pal-requestserver
- Extend field size to prevent unit tests from failing
- Fix wrong dependency version in fix-shared
- Make fix data in column wider

### Dependency changes
- Upgrade to Kotlin 1.9.10
- Bump EnricoMi/publish-unit-test-result-action from 1 to 2
- Bump actions/checkout from 2 to 3
- Bump actions/checkout from 3 to 4
- Bump actions/setup-java from 2 to 3
- Bump artifactory-maven-plugin from 3.2.3 to 3.6.1
- Bump com.github.gantsign.maven:ktlint-maven-plugin from 2.0.0 to 3.0.0
- Bump commons-codec from 1.15 to 1.16.0
- Bump foundationdb-rs/foundationdb-actions-install from 2.0.0 to 2.1.0
- Bump junit from 4.13 to 4.13.2 b
- Bump maven-assembly-plugin from 2.6 to 3.6.0
- Bump maven-compiler-plugin from 3.8.0 to 3.11.0
- Bump maven-dependency-plugin from 3.1.1 to 3.6.0
- Bump maven-deploy-plugin from 2.8.2 to 3.1.1
- Bump maven-jar-plugin from 3.1.1 to 3.3.0
- Bump maven-plugin-annotations from 3.4 to 3.9.0
- Bump maven-plugin-api.version from 3.0 to 3.9.2
- Bump maven-plugin-api.version from 3.9.2 to 3.9.3
- Bump maven-plugin-api.version from 3.9.3 to 3.9.4
- Bump maven-plugin-api.version from 3.9.4 to 3.9.5
- Bump maven-plugin-plugin from 3.6.0 to 3.9.0
- Bump maven-release-plugin from 3.0.0 to 3.0.1
- Bump maven-release-plugin from 3.0.0-M5 to 3.0.0
- Bump maven-surefire-plugin from 3.0.0-M3 to 3.1.0
- Bump maven-surefire-plugin from 3.1.0 to 3.1.2
- Bump objenesis from 2.6 to 3.3
- Bump org.codehaus.mojo:versions-maven-plugin from 2.16.0 to 2.16.1
- Bump quickfix.version from 2.3.0 to 2.3.1
- Bump versions-maven-plugin from 2.13.0 to 2.15.0
- Bump versions-maven-plugin from 2.15.0 to 2.16.0

## Genesis 7.0.0(auth-server)

### Breaking changes
- Added REFRESH_AUTH_TOKEN to loginAuthNack in case of 2nd factor auth failure
- Converted Login and Logout endpoints to GPAL

### Features
- Add tracing support in LoginController
- Update auth in line with GenesisScriptHost changes

### Fixes
- Clustered GENESIS_AUTH_MANAGER printing error logs backport
- Correct usages of HOSTNAME field in type safe login / logout GPAL API to match router
- Only insert/delete RIGHT_SUMMARY records when necessary to prevent race conditions
- Removing references from aerospike
- Change max heap for processes from 128mb to 256mb
- Handle out of sync updates on auth-perms

### Dependency changes
- Ensure test tags are respected when passing via gradle arguments.
- Upgrade to Kotlin 1.9.10
- Bump com.github.tomakehurst:wiremock-jre8 from 2.35.0 to 3.0.1
- Bump com.jfrog.artifactory from 4.32.0 to 5.1.10
- Bump com.unboundid:unboundid-ldapsdk from 6.0.9 to 6.0.10
- Bump jjwtVersion from 0.11.5 to 0.12.2
- Bump org.gradle.test-retry from 1.5.3 to 1.5.6
- Bump org.jetbrains.kotlinx.kover from 0.6.1 to 0.7.3
- Bump org.jlleitschuh.gradle.ktlint from 11.5.1 to 11.6.0
- Bump org.mockito.kotlin:mockito-kotlin from 5.0.0 to 5.1.0
- Bump org.passay:passay from 1.6.3 to 1.6.4
- Bump org.sonarqube from 4.2.1.3168 to 4.3.1.3277

## Genesis 7.0.0(elektron-server)

### Dependency changes

- Bump EnricoMi/publish-unit-test-result-action from 1 to 2
- Bump actions/checkout from 2 to 4
- Bump actions/setup-java from 2 to 3
- Bump org.apache.maven.plugins:maven-compiler-plugin from 3.1 to 3.11.0
- Bump org.apache.maven.plugins:maven-deploy-plugin from 2.8.2 to 3.1.1
- Bump org.apache.maven.plugins:maven-release-plugin from 3.0.0-M5 to 3.0.1

## Genesis 7.0.0(reporting-server)

### Dependency changes

- Upgrade to Kotlin 1.9.10
- Bump EnricoMi/publish-unit-test-result-action from 1 to 2
- Bump actions/checkout from 2 to 3
- Bump actions/setup-java from 2 to 3
- Bump foundationdb-rs/foundationdb-actions-install from 2.0.0 to 2.1.0
- Bump org.apache.maven.plugins:maven-assembly-plugin from 3.2.0 to 3.6.0
- Bump org.apache.maven.plugins:maven-compiler-plugin from 3.8.0 to 3.11.0
- Bump org.apache.maven.plugins:maven-deploy-plugin from 2.8.2 to 3.1.1
- Bump org.apache.maven.plugins:maven-release-plugin from 3.0.0-M5 to 3.0.1
- Bump org.apache.maven.plugins:maven-surefire-plugin from 3.0.0-M4 to 3.1.2
- Bump org.codehaus.mojo:versions-maven-plugin from 2.13.0 to 2.16.0
- Bump org.jfrog.buildinfo:artifactory-maven-plugin from 3.2.3 to 3.6.1

## Genesis 7.0.0(genesis-notify)

### Fixes
- Use systemDefaultUsername as sender, only send from user email if configured to

### Dependency changes
- Upgrade to Kotlin 1.9.10 from 3.1.1 to 7.0.1
- Bump org.gradle.test-retry from 1.2.1 to 1.5.4
- Bump org.jetbrains.kotlinx:kotlinx-coroutines-test from 1.7.0-RC to 1.7.3
- Bump org.simplejavamail:simple-java-mail from 7.2.1 to 8.1.3

## Genesis 7.0.0(ref_data_app-server)

### Dependency changes
- Upgrade to Kotlin 1.9.10

## Genesis 7.0.0(genesis-file-server)

### Features
- Make FileStorageManager an injectable bean for use elsewhere in the server

### Dependency changes
- Upgrade to Kotlin 1.9.10
- Bump actions/checkout from 3 to 4
- Bump com.amazonaws:aws-java-sdk-s3 from 1.12.450 to 1.12.543
- Bump com.jfrog.artifactory from 4.24.21 to 5.1.10
- Bump foundationdb-rs/foundationdb-actions-install from 2.0.0 to 2.1.0
- Bump org.jetbrains.kotlinx.kover from 0.6.1 to 0.7.3
- Bump org.sonarqube from 3.3 to 4.4.1.3373

## Genesis 7.0.0(market-data-server)

### Dependency changes
- Upgrade to Kotlin 1.9.10
- Bump EnricoMi/publish-unit-test-result-action from 1 to 2 .com/genesislcap/market-data-server/pull/30
- Bump actions/setup-java from 2 to 3
- Bump foundationdb-rs/foundationdb-actions-install from 2.0.0 to 2.1.0
- Bump org.apache.maven.plugins:maven-assembly-plugin from 3.3.0 to 3.6.0
- Bump org.apache.maven.plugins:maven-compiler-plugin from 3.8.0 to 3.11.0
- Bump org.apache.maven.plugins:maven-jar-plugin from 3.2.0 to 3.3.0
- Bump org.codehaus.mojo:versions-maven-plugin from 2.13.0 to 2.16.1

## Genesis 6.6.24(genesis-server)

### Fixes
- Reduce data server memory usage 










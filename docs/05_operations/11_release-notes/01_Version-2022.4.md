---
title: 'Release notes - Version 2022.4'
sidebar_label: 'Version 2022.4'
sidebar_position: 2
id: version-2022-4
keywords: [operations, release notes, v-2022.4]
tags:
    - operations
    - release notes
    - v-2022.4
---

## Release notes
This is version v2022.4 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.4.0   |  
| web           | 6.0.0   |   

Release date: December 19, 2022. 

## Features
* **OpenID Connect Integration** - The Genesis low-code platform now supports OpenId Connect as an authentication mechanism. The configuration of OpenId Connect providers is done through GPAL, with all of its benefits, including intellisense, autocompletion and compile-time errors. An application can have more than one OpenId Connect provider configured.
* **GPAL for Dynamic Permissions** - You can now use GPAL to define dynamic permissions with a strongly typed data model, intellisense and autocompletion. Dynamic permissions can now be defined for tables and views.
* **DevOps/Containerisation**
  - Now allows Consul service names to be configured via the new system definition value `ConsulServiceNamePattern`.
  - Now allows service ports to be overridden via environment variable in the format of `{Process_name}_PORT`.

## Genesis Server Framework (GSF)

### Features

- Genesis as a source functionality E2E
    - Reuse database configuration in sources
- Add userCacheBatchingPeriod option to auth-perms GPAL

### Bugfixes

- Fixed issue with notifications thread dying in some scenarios.
- We changed the dictionary-cache dependency to `compileOnly` in the messages module in server project template to ensure correct project generation.
- When resolving search paths for code generations, we now use the absolute path of the config module rather than assuming it is an immediate child of the root project directory.
- Hyphens are now allowed in product names.
- We now prevent HTTP timeouts when using MORE_ROWS messages for dataserver queries via HTTP API.
- The permission codes supplied for Request Servers are now correctly respected.
- The name of the ALERT table, used in notification rules, has been changed to prevent clashes with other products.
- Fixed error on Data Server when using negated absolute values for BigDecimal types
- GPAL usage of dynamic permissions (e.g. Data Servers, Request Servers, Event Handlers, etc.) now also read all GPAL auth perms definitions available.
- HTTP Request Server requests have been made case-insensitive.
- Added `showValue` to help command output in `DbMon`.
- We now ensure that the minimum batching period for backward joins internal cache is always higher than 0 to avoid maxing out a single CPU.
- `ClearCodegenCache`: added args to main method so the compiler recognises it as a valid main method.

### Other changes
- Removed usage of khttp library.
- Upgraded Ivy version to 2.5.1 (used in groovy scripts).
- Upgraded org.codehaus.plexus:plexus-utils from 3.4.2 to 3.5.0 (maven plugins).
- Upgraded org.apache.maven.plugins:maven-install-plugin from 3.0.0 to 3.0.1 (maven plugins).
- Upgraded org.apache.maven.plugin-tools:maven-plugin-annotations from 3.6.4 to 3.7.0 (maven plugins).
- Upgraded Apache Commons Text to 1.10
- We now use JVM args and sysdef flags to control heap dump on OOM instead of defunct jmap cmd.
- We have reduced excessive logging in Data Servers.
- We have upgraded camel-bom to version 3.18.4 and symphony-bom to version 2.11.1 to avoid critical vulnerabilities.
- We have now excluded snakeyaml from the build to avoid vulnerabilities.
- Improved Auth Perms performance.
- Views `USER_INSERT_VIEW` and `USER_AMEND_VIEW` now support a new `DOMAIN` field.

### Known issues

- An issue has been identified, which requires the application of the following setting,

```jsx
tasks.withType<Jar> {
    duplicatesStrategy = DuplicatesStrategy.WARN
}
```

This must be applied to the `build.gradle.kts`. It has been applied to the blank-app-seed project. Later versions of the blank-app-seed might remove this setting.



## Foundation UI changes
This is a high-level overview of the changes.

### Features
* Added a `foundation-layout` package to provide application and route-based layout, similar to [Golden Layout](https://golden-layout.com/). Most APIs are in [@beta](https://api-extractor.com/pages/tsdoc/tag_beta/), but feel free to test these before full public release.
* Added a `foundation-criteria` package to provide a type-safe criteria builder for generating queries.
* Added a `foundation-filters` package to provide a collection of client-side filters that can be used in complex logic chains ([docs](../../../web/filters/foundation-filters/)).
* Added support for OpenID SSO in `foundation-login`.
* Added bubble and scatter chart types.
* Added drag-and-drop field ordering functionality to `foundation-reporting`.
* Added `genx --insecure` mode to deal with corporate proxy/networks that use self-signed or missing certificates.
* Provided more real-world examples of how to test using `foundation-testing`, see [here](https://github.com/genesislcap/foundation-ui/tree/v2022.4/packages/foundation/foundation-filters/src) and [here](https://github.com/genesislcap/foundation-ui/tree/v2022.4/packages/foundation/foundation-criteria/src). E2E testing pattern will follow shortly.

### Maintenance
* Datasource refinements
* Logout cookie/data cleanup improvements
* Charting memory cleanup improvements
* Entity-management styling improvements
* Flyout improvements
* General multiselect improvements including memory cleanup
* Documentation updates

### Mapping
This release maps to 6.0.0 of foundation ui packages.

### Migration guide
* If you use ag-grid in your project, please update to v28.
* options-datasource now accepts both value and label 

```jsx
<options-datasource
  resourceName="COUNTERPARTY"
  value-field="COUNTERPARTY_ID"
  label-field="NAME"
></options-datasource>
```

* If you’re using the flyout component, you no longer have access to the `openFlyout` and `closeFlyout` functions. Use the `closed` attribute on the component to drive visibility. 
* util `formatDate` should be changed to `formatDateTimestamp`
* util `formatDateTime` should be changed to `formatDateTimeTimestamp`
* util `formatEpochToDate` should be changed to `formatTimestamp`
* If the entity-management component is suddenly not showing up, make sure the enclosing component has set width and hight, or check what its display css option is.


## Early access - DSL changes

### Data visualisation and charting
  - The following chart types can now be implemented using existing data sources: Area, Bar, Column, Dual Axes, Line, Pie, Donut and Rose.
  - Charts will dynamically update, based on user interaction with a linked component: for example, selecting a row in a linked Grid.

### Fixes
* Updated the default Web server port 9000 from 5000 to prevent clashing with the Airplay service on OSX.
* Users can now declare a field in the DSL with the same name as a field in the Genesis fields dictionary - even if the two fields don't have the same type and property. 
* We have fixed an issue where the Web server was intermittently crashing during application deployment.
* When an end user of an application built with the DSL performs an 'update' action, the correct State Transition will occur and the Grid component will still display further updates.
* Selecting an item on a Linked Grid or Chart now returns the required data.

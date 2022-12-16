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
| server        | 6.3.2   |  
| web           | x.0.0   |   

Release date: December 19, 2022. 

## Genesis Server Framework (GSF)

### Features:
* OpenID Connect Integration - The Genesis low-code platform now supports OpenId Connect as an authentication mechanism. The configuration of OpenId Connect providers is done through GPAL, with all of its benefits, including intellisense, autocompletion and compile-time errors. An application can have move than one OpenId Connect provider configured.
* GPAL for Dynamic Permissions - Application Developers can now use GPAL to define dynamic permissions with a strongly typed data model, intellisense and autocompletion. Dynamic permissions can now be defined for tables and views.


### GSF 6.3.2 changes


### GSF 6.3.x changes

- 

## Auth 6.2.1 changes
- 

## Auth 6.2.x changes



## GSF changes in full

Features
* data-pipeline: Genesis as a source functionality E2E 
* When resolving search paths for code gen, you can now use the absolute path of the config module rather than assuming it is an immediate child of the root project directory.
* db configuration can be reused in sources. 
* userCacheBatchingPeriod has been added to perms. 
* [Snyk] Upgrade org.codehaus.plexus:plexus-utils from 3.4.2 to 3.5.0 
* [Snyk] Upgrade org.apache.maven.plugins:maven-install-plugin from 3.0.0 to 3.0.1 
* [Snyk] Upgrade org.apache.maven.plugin-tools:maven-plugin-annotations from 3.6.4 to 3.7.0 
* chore: sonar qube now includes subscore in code analysis  
* chore: commons configuration version bump by 
* chore: deleted obsolete class 
* chore: allow overrides for the ports which the processes run on 
* chore: upgrade ivy version to 2.5.1
* build: Add genesis-pal-permissions to maven submodules gradle config to enforce build task order 

The following fixes have been made

* Removed usage of khttp 
* Linting ((**Detail needed, or this will be removed**))
* Issue with notifications thread dying  
* Dictionary-cache dependency changed to compileOnly in messages module in the server project template 
* Allow hyphens in product names 
* Prevent HTTP timeouts when using MORE_ROWS via HTTP 
* Ensure permission codes supplied for CustomReqReps are respected 
* Backwards-compatible map configuration 
* Rename ALERT table to prevent clash, add to checklist, fix review guidance link
* Error on Data Server when using bigdecimal abs negated 
* Reading all gpal auth perms available 
* Make HTTP ReqRep requests case-insensitive 
* Update nginx config used in containers to support http requests 
* Use JVM args and sysdef flags to control heap dump on OOM instead of the defunct jmap cmd 
* Add showValue to help command output in DbMon PTC-769
* Ensure the minimum batching period is always higher than 0 to avoid maxing out a single CPU. 
* Use correct JVM arg syntax in python3 startProcess  
* Reduce excessive logging in Data Servers.
* (ClearCodegenCache): Add args to main method so compiler recognises it as a valid main method.
* Upgrade camel-bom and symphony-bom to avoid critical vulnerabilities.
* Revertion. A new feature where mssql fields can take max length has been reverted.
* Revertion. A new feature where the 'USER' table has been updated with unique indices for 'REFRESH_TOKEN' has been reverted.

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
* datasource refinements
* logout cookie/data cleanup improvements
* charting memory cleanup improvements
* entity-management styling improvements
* flyout improvements
* general multiselect improvements including memory cleanup
* documentation updates

### Mapping
This release maps to 6.0.0 of foundation ui packages.

### Migration guide
* If you use ag-grid in your project, please update to v28.
* options-datasource now accepts both value and label 
 ```
<options-datasource
  resourceName="COUNTERPARTY"
  value-field="COUNTERPARTY_ID"
  label-field="NAME"
></options-datasource>
```
*  If you’re using the flyout component, you no longer have access to the `openFlyout` and `closeFlyout` functions. Use the `closed` attribute on the component to drive visibility. 
* util `formatDate` should be changed to `formatDateTimestamp`
* util `formatDateTime` should be changed to `formatDateTimeTimestamp`
* util `formatEpochToDate` should be changed to `formatTimestamp`
* if entity-management component is suddenly not showing up make sure the enclosing component has set width and hight or check what display css option it has



## Early access - Gpalx (Fuse) changes

### Data visualisation and charting
  - The following chart types can now be implemented using existing data sources: Area, Bar, Column, Dual Axes, Line, Pie, Donut and Rose.
  - Charts will dynamically update, based on user interaction with a linked component: for example, selecting a row in a linked Grid.

### Fixes
* Updated the default Web server port 9000 from 5000 to prevent clashing with the Airplay service on OSX.
* Allow users to declare a field in the DSL with the same name as a field in the Genesis fields dictionary - even if the two fields don't have the same type and property. 
* Fixed issue where the Web server was intermittently crashing during application deployment.
* When an end user of an application built with the DSL performs an 'update' action, the correct State Transition will occur and the Grid component will still display further updates.
* Selecting an item on a Linked Grid or Chart now returns the required data.

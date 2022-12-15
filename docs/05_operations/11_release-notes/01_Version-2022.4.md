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
| server        | 6.x.x   |  
| web           | x.0.0   |   

Release date: December 21, 2022. 

## Genesis Server Framework (GSF)





### GSF 6.2.x changes


### GSF 6.2.x changes

- 

## Auth 6.2.x changes
- 

## Auth 6.2.x changes



## GSF changes in full
- Feat: OpenID Connect Integration - Application Developers can now use GPAL to configure integration with OpenID Connect Provider

Features

-  

The following fixes have been made

- 
- 

## Foundation UI changes
This is a high-level overview of the changes.

### Features:
* Added a `foundation-layout` package to provide application and route-based layout functionality similar to [Golden Layout](https://golden-layout.com/). Most APIs are in [@beta](https://api-extractor.com/pages/tsdoc/tag_beta/), but feel free to test before full public release.
* Added a `foundation-criteria` package to provide a type-safe criteria builder for generating queries.
* Added a `foundation-filters` package to provide a collection of client-side filters that can be used in complex logic chains ([docs](https://docs.genesis.global/secure/web/filters/foundation-filters/)).
* Added support for OpenID SSO in `foundation-login`.
* Added bubble and scatter chart types.
* Added drag-n-drop field ordering functionality to `foundation-reporting`.
* Added `genx --insecure` mode to deal with corporate proxy/networks that use self-signed or missing certificates.
* Provided more real-world examples of how to test using `foundation-testing`, see [here](https://github.com/genesislcap/foundation-ui/tree/v2022.4/packages/foundation/foundation-filters/src) and [here](https://github.com/genesislcap/foundation-ui/tree/v2022.4/packages/foundation/foundation-criteria/src). E2E testing pattern will follow shortly.

### Maintenance:
* Datasource refinements.
* Logout cookie/data cleanup improvements.
* Charting memory cleanup improvements.
* Entity-management styling improvements.
* Flyout improvements.
* General multiselect improvements including memory cleanup.
* Documentation updates.

### Mapping:
This release maps to 6.0.0 of foundation ui packages.

### Migration guide:
* if you use ag-grid in your project please update to v28
* options-datasource now accepts both value and label 
 ```
<options-datasource
  resourceName="COUNTERPARTY"
  value-field="COUNTERPARTY_ID"
  label-field="NAME"
></options-datasource>
```
*  if you’re using flyout component you will no longer have access to `openFlyout` and `closeFlyout` fuctions. Instead you should use `closed` attribute on the component to drive visibility
* util `formatDate` should be changed to `formatDateTimestamp`
* util `formatDateTime` should be changed to `formatDateTimeTimestamp`
* util `formatEpochToDate` should be changed to `formatTimestamp`
* if entity-management component is suddenly not showing up make sure the enclosing component has set width and hight or check what display css option it has



## Early access - DSL changes

- Feat: Data Visualisation & Charting
  - The following chart types can now be implemented using existing data sources: Area, Bar, Column, Dual Axes, Line, Pie, Donut and Rose.
  - Charts will dynamically update based on user interaction with a linked component, for example selecting a row in a linked Grid.
- Fix: Updated the default Web server port 9000 from 5000 to prevent clashing with the Airplay service on OSX.
- Fix: Prevent an error being thrown and allow a user to declare a field in the DSL with the same name as a field in the Genesis fields dictionary when both fields don't have the same type and properties.
- Fix: Fixed issue whereby the Web server would intermittently crash during application deployments.
- Fix: When an end user of an application built with the DSL performs an 'update' action, the correct State Transition will occur and the Grid component will still display further updates.
- Fix: Selecting an item on a Linked Grid or Chart now returns the required data.

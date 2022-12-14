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

## Maintenance

- 
- 



### Breaking changes 

- 


## Early access - DSL changes

- Feat: Data Visualisation & Charting
  - The following chart types can now be implemented using existing data sources: Area, Bar, Column, Dual Axes, Line, Pie, Donut and Rose.
  - Charts will dynamically update based on user interaction with a linked component, for example selecting a row in a linked Grid.
- Fix: Updated the default Web server port 9000 from 5000 to prevent clashing with the Airplay service on OSX.
- Fix: Prevent an error being thrown and allow a user to declare a field in the DSL with the same name as a field in the Genesis fields dictionary when both fields don't have the same type and properties.
- Fix: Fixed issue whereby the Web server would intermittently crash during application deployments.
- Fix: When an end user of an application built with the DSL performs an 'update' action, the correct State Transition will occur and the Grid component will still display further updates.
- Fix: Selecting an item on a Linked Grid or Chart now returns the required data.
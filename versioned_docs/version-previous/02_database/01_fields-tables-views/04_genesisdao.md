---
title: 'Generating DAOs'
sidebar_label: 'Generating DAOs'
id: genesisDao
keywords: [database, DAOs]
tags:
    - database
    - DAOs
---

The fields, tables and views you define must be turned into [DAO](../../../getting-started/glossary/glossary/#dao)s (Database Access Objects).

There are five hierarchical levels:

1. System Definition
    - Firstly, system definition items, used for common system overrides. It is important that these are first, as we can then make the rest configurable, based on their set-up (e.g. turn fields/tables on and off with a boolean system definition item).
2. Fields
    - Fields are the top level of the DAO; they can be shared amongst tables and so are built ahead of tables.
3. Tables
    - Create the DAOs for all the system tables.
4. HFT
    - The [HFT](../../../getting-started/glossary/glossary/#hft) layer is a cache sitting above the database for rapid access to the data; it is used for rapidly updated data, such as price.
5. Views
    - Views are the final layer and are used in many Genesis components. They enable us to take fields from more than one table to create a coherent view of information.

Each layer uses the layers above in the hierarchy, so `fields` can use `system definitions` and `views` can use all the other four.

## Running the commands

If you use intelliJ's gradle option, you have a project with a _project_name_**-dictionary-cache** submodule. This contains the tasks for generating Genesis DAOs.

![](/img/gradle-intellij-menu.png)

Each of the following has a sub-menu that takes you to the `assemble` build task:

![](/img/gradle-intellij-assemble.png)

### Commands for DAO generation

|Dao Type|Gradle Task|
|--|--|
|System Definition|`genesis-generated-sysdef`|
|Fields|`genesis-generated-fields`|
|Tables|`genesis-generated-dao`|
|HFT|`genesis-generated-hft`|
|Views|`genesis-generated-view`|

### Bundling generated code with product distribution

You can bundle the generated code with the product distribution. This shortens the deployment time, because remap skips the code-generation step.

To do this, you must do two things:

1. When you build the distribution, set the following gradle property to `true` :

```properties
bundleGeneratedClasses=true
```

2. Set the "DEPLOYED_PRODUCT" System Definition property. You can read more about that [here](../../../server/configuring-runtime/system-definitions/#items-defined).

## Troubleshooting

### Gradle build errors in project and no gradle commands listed in IntelliJ 

If you don't see any menu options per the guide above, and you see gradle errors when you try to build or open a project, a common cause is gradle JVM settings.

In IntelliJ. go to **File** -> **Settings** and search for the Build Gradle page. Make sure Gradle JVM is set to the correct JDK version used by Genesis. If you are using Genesis Server version 7+, this is **17**; otherwise **11**. For setting version **11**, see the example below:

![](/img/gradle-jvm-version.png)

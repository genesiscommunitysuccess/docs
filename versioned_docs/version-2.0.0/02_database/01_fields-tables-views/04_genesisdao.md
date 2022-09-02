---
title: 'Generating DAOs'
sidebar_label: 'Generating DAOs'
id: genesisDao
---

[Introduction](/database/fields-tables-views/fields-tables-views/)  | [Fields](/database/fields-tables-views/fields/)  | [Tables](/database/fields-tables-views/tables/)  |
 [Views](/database/fields-tables-views/views/)  

The fields, tables and views you define must be turned into [DAO](/getting-started/glossary/glossary/#DAO)s (Database Access Objects).

There are five hierarchical levels:

1. System Definition
    - Firstly, system definition items, used for common system overrides. It is important that these are first, as we can then make the rest configurable, based on their set-up (e.g. turn fields/tables on and off with a boolean system definition item)
2. Fields
    - Fields are the top level of the DAO; they can be shared amongst tables and so are built ahead of tables
3. Tables
    - Create the DAOs for all the system tables
4. HFT
    - The [HFT](/getting-started/glossary/glossary/#hft) layer is a cache sitting above the database for rapid access to the data; it is used for rapidly updated data, such us price
5. Views
    - Views are the final layer and are used in many Genesis components. They enable us to take fields from more than one table to create a coherent view of information 

Each layer uses the layers above in the hierarchy, so `fields` can use `system definitions` and `views` can use all the other four.

## Running the commands

Using intelliJ's gradle option, you will have a project with a _project_name_**-dictionary-cache** submodule, which contains the tasks for generating Genesis DAOs.

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

### Troubleshooting

#### Gradle build errors in project and no gradle commands listed in intelliJ 

If you don't see any menu options per the guide above, and see gradle errors trying to build or on opening a project, a common cause is gradle jvm settings.

In IntelliJ go to `File` -> `Settings` and search for the Build Gradle page. Make sure Gradle JVM is set to 11, as shown below:

![](/img/gradle-jvm-version.png)

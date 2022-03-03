---
id: relational-db-data-from-scratch
sidebar_label: Generate fields and tables from relational database
sidebar_position: 20
title: Generate fields and tables from a relational database

---
## Introduction ##
This exercise walks you though how to set up a Genesis project using [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html) and to generate fields and tables configuration from an existing relational database. At the end, you will have generated fields and tables that you can then use to develop applications that use the same database model.

## Prerequisites ##

You will need between 10 and 15 minutes to finish this guide.

Required software: 
 - JDK 11
 - Maven
 - IntelliJ IDEA
 - Genesis Platform installed either on remote host or locally

Versions used while writing this guide:
 - JDK 11.0.11
 - Maven 3.8.1
 - IntelliJ IDEA 2021.2.1
 - Genesis Platform 5.2

:::note
You will need access to a Maven repository that provides the Genesis LCNC Platform
:::

## Steps ##

This exercise has the following steps:
1. Generate the new dictionary files. 
2. Generate the project.
3. Move the files to the correct location.
4. Build the project.
5. Open the project in IntelliJ.

### Exploring the source database ###
For the purposes of this guide, we have set up a database with four tables:
 - `alt_counterparty_id`
 - `alt_instrument_id`
 - `counterparty`
 - `instrument`

You can see these using Dbeaver:
![Database Tables](/img/dbeaver-screenshot.png)

### Generate the dictionary files ###
:::note
The command from this step has to be executed from where the Genesis Platform is set up (be it either a local installation or on remote host).
:::

The product that we create will be called **ref_data_app**. Using the instance in which the platform is installed, run:
```bash
DictionaryBuilder -t <database-type> -U <username> -P <password> -p <database-port> -H <database-host> -d tradingapp --product <product-name> -o <output-directory> -i 200 --tables <comma-separated-table-names>
```
For example, if there is an MSSQL database running on AWS, a sample command would look like:
```bash
DictionaryBuilder -t MSSQL -U admin -P Password11 -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument
```

Once the command has finished, it will generate the `fields-dictionary.kts` and `tables-dictionary.kts` files for the data model. Keep these files handy, as you will have to copy them over in the next steps.

### Generate the project ###
Genesis provides a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html) to generate a skeleton project that will host all the necessary modules and the configuration for an application. To use it, open a terminal and execute:
```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=<group_id> -Dversion=1.0.0-SNAPSHOT -DinteractiveMode=true -DarchetypeVersion=5.2.0 -DartifactId=<artifact_id>
```

Note that if your terminal is PowerShell, you will have to wrap the arguments in quotes:
```powershell
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=<group_id>" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=<artifact_id>"
```

For this guide `sample.trade` for `groupId` and `ref-data-app` for `artifactId` will be used. The final command would be
```powershell
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=sample.trade" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=ref_data_app"
```

### Move the files to the required location ###

Move the generated **ref_data_app/cfg** files (from the previous `DictionaryBuilder` step) to the **ref_data_app-config/src/main/resources/cfg** folder.

![](/img/copy-generated-script-files-inside-ref_data_app-script-config.png)

### Build the project ###
Once the project is generated, change directory to it and execute `mvn package`:

```bash
cd ref_data_app
mvn package
```

This will download all necessary dependencies and generate the Genesis files required for development.

:::note
Make sure you have access to the Maven repository that provides the Genesis Platform. Otherwise, this step will fail
:::

### Open the project in IntelliJ IDEA ####

Once the project is built, you can open it in IntelliJ IDEA. The DSL that is used is based on Kotlin and IntelliJ IDEA is the recommended IDE. If another one is used, you won't be able to use the autocompletion and type-safe features during development (unless additional plugins are installed).

Once the project is open, you will notice that it is a [multi module maven project](https://maven.apache.org/guides/mini/guide-multiple-modules.html). The `README.md` provides a high-level overview of the generated projects. 

Starting from the top, let's open `ref_data_app-config`. This contains all the configuration. Navigate to `ref_data_app-config/src/main/resources/config/` to explore them. The `fields-dictionary.kts` and `tables-dictionary.kts` files have been generated by the `DictionaryBuilder` command. If you open and explore them, you can see that they contain the same data model as the database we started with.

## Conclusion ##
Congratulations! You just created a Genesis project from scratch. You extracted the data model from a running database and used that model in a Genesis project.
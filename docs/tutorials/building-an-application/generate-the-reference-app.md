---
id: reference-app
title: Generate the reference app
sidebar_label: Generate the reference app
sidebar_position: 1

---
In this first exercise, we shall generate the reference application with its database of reference data. We shall create thsi from the existing RDBMS of reference data.

Before you start. Make sure you have the platform and all the relevant tools [installed](/getting-started/get-ready-to-develop/install/).The Genesis LCNC must be installed on a server, local vm, wsl or cloud instance (genesis and auth).

Ideally, Maven should be installed in the server instance with adequate configuration to retrieve genesis binaries.

Otherwise, the Maven installation and configuration must be available in a local development environment.

## The source database

There are four tables in the source relational database. You can see these in DBeaver.

![](/img/dbeaver-screenshot.png)

In this exercise, we are going to convert the contents of that database so that we have fields, tables and views. From this data model, we can build our Genesis application. And we shall generate a server with basic functions.

## 1. Generate the dictionary files

The **DictionaryBuilder** script reads the source database and generates the appropriate fields, tables and views in Genesis format. These are stored in two files:

* **-fields-dictionary.kts**
* **-tables-dictionary.kts**

We shall call the product that we create **ref_data_app**. All the files we create will start with that name.

Using the instance in which the platform is installed, run

`DictionaryBuilder -t MSSQL -U admin -P Password11 -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument`

Note that we specified the names of the four source tables in the **--tables** argument of the command.

The **dictionaryBuilder** script generates the **fields-dictionary.kts** and **tables-dictionary.kts** files for the data model.

![](/img/dictionary-builder-screenshot.png)

Check these files and adjust them to suit your application. For example, look inside the **fields-dictionary.kts** file to see the field definitions.

The process has translated the field ENABLED as an INT type.
```kotlin
    field(name = "ENABLED", type = INT)
```
You need to edit that to make it a BOOLEAN type.
```kotlin
    field(name = "ENABLED", type = BOOLEAN)
```
## 2. Copy files and run genesisInstall

Create a new ref_data_app folder structure inside GENESIS_HOME, including cfg and script folders.

Copy the output files from the dictionary build to the **ref_data_app/cfg** folder inside the run directory.

Run **genesisInstall** to verify everything is ok.

![](/img/genesisinstall.png)

## 3. Run AppGen to build microservices

Run **AppGen** to build your three modules (event handler, request server and data server):

```bash
AppGen -n ref_data_app -p 10000
```

![](/img/appgen.png)

This gives you kts files for your new modules:

* scripts/ref_data_app-dataserver.kts
* scripts/ref_data_app-reqrep.kts
* scripts/ref_data_app-eventhandler.kts

![](/img/appgen.png)

And it generates xml files for service definitions and processes:

* cfg/ref_data_app-service-definitions.xml
* cfg/ref_data_app-processes.xml

Optionally, you could now run **remap**, which would give you CRUD operations for all the tables and request replies (static data from the request server), as well as for real-time data retrieval (via the data server).

But for this example application, we are going to go into the pro code, to add some sophistication.

## 4. Prepare for pro code

### Build a maven project

First, you need to build a maven project so that you can use an IDE to build the app.

You can run the **mvn** command either locally (in the server, local vm, wsl or cloud instance where the LCNC Platform is installed) or a separate local dev machine. In our example, we are using the same machine as before for consistency.

Run the **mvn** command:

```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.2.0 -DartifactId=ref_data_app -B
```

This gives you the following project structure:

![](/img/maven-archetype-result.png)

### Move the files to the required location

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

![](/img/copy-generated-script-files-inside-ref_data_app-script-config.png)

Locate the generated files for the request server, data server and event handler. These are in the  **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.

![](/img/copy-generated-script-files-inside-ref_data_app-script-config.png)

### Install the maven project

Now run `mvn install`.

![](/img/build-maven-project-using-mvn-install.png)

Again, you need to move the script and config files. Have these to hand, so you can copy them easily:

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

Locate the generated files for the request server, data server and event handler. These are in the  **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.

### Install the maven project in intellij

In intellij, run `mvn install`.

![](/img/run-maven-install-in-intellij.png)

That's it. You have all the files in a project, ready for you to work in your IDE. In the following steps, you'll be working here to add key functionality to the application.
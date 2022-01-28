---
id: reference-app
title: Generate the reference app
sidebar_label: Generate the reference app
sidebar_position: 1

---
In this first exercise, we shall generate the reference application with its database of reference data. We shall create this from the existing RDBMS of reference data.

<!-- TODO - run from CLI tool instead, should be elsewhere in docs and reference-->
Ideally, Maven should be installed in the server instance. It should be configured so that you can retrieve Genesis binaries.

Otherwise, the Maven installation and configuration must be available in a local development environment.

:::important

Before you start, create a new folder as a working area for the project under the GENESIS HOME folder (**~**). Call this folder **TradePosApp**. This makes sure that all the files for this application will be separate from any other work you are doing. Change directory to this folder so that you are ready to start.

:::

<!--TODO Rename to ref-data-app throughout - 5.6.2 when CLI tool ready-->


## The source database

There are four tables in the source relational database. 

1. Counterparty - containing Counterparties
2. Alt Counterparty ID - containing alternative IDs for counterparties (a simple table and common paradigm for systems integrating with external systems, to lookup and normalise IDs)
3. Instrument - containing Market instruments
4. Alt Instrument ID - containing alternative IDs for instruments
<!-- TODO move this to refer to branching model -->
<!-- TODO link to docker image for running it as an option -->
If you want to look at the source database in more detail, you can use a tool such as [DBeaver](https://dbeaver.com/).

![](/img/reference-data-dbeaver.png)

In this exercise, we are going to convert the contents of these tables so that we have a single data model of fields, tables and views. 

## 1. Generate the dictionary files

The `DictionaryBuilder` script reads the source database and generates the appropriate fields, tables and views in Genesis format. These are stored in two files:  

* **-fields-dictionary.kts**
* **-tables-dictionary.kts**

We shall call the product that we create **ref_data_app**. All the files we create will start with that name.

Using the instance in which the platform is installed, run

<!--TODO - rethink this. Speak TOM and JOSE do not show the password we have here and make sure not admin user -->
`DictionaryBuilder -t MSSQL -U admin -P Password11* -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument`

Note that we specified the names of the four source tables in the `--tables` argument of the command. So you can include just a subset of your source database if you wish.

The `dictionaryBuilder` script generates the **fields-dictionary.kts** and **tables-dictionary.kts** files for the data model.

<!-- TODO move below to IntelliJ / local running or leave?-->
![](/img/dictionary-builder-output.png)

Next we should check these files and adjust them to suit your application. For example, look inside the **fields-dictionary.kts** file to see the field definitions.

In some cases, the process translates the `ENABLED` field as an `INT` type.
```kotlin
    field(name = "ENABLED", type = INT)
```
We need this field to be type `BOOLEAN`. If necessary, edit the field to make it `BOOLEAN` type.

```kotlin
    field(name = "ENABLED", type = BOOLEAN)
```

See here <!--TODO we need to merge all this with the Generate fields and tables from relational database --> for more helpful tips using the DictionaryBuilder tool.

## 2. Run AppGen to build microservices

Run `AppGen` to build your three modules (event handler, request server and data server):

```bash
AppGen -n ref_data_app -p 10000
```

![](/img/appgen.png)

As you can see, this gives you kts files for your new modules:

* scripts/ref_data_app-dataserver.kts
* scripts/ref_data_app-reqrep.kts
* scripts/ref_data_app-eventhandler.kts

And it generates xml files for service definitions and processes:

* cfg/ref_data_app-service-definitions.xml
* cfg/ref_data_app-processes.xml

Optionally, you could now run `remap`, which would give you CRUD operations for all the tables and request replies (static data from the request server), as well as for real-time data retrieval (via the data server).

But for this example application, we are going to go into the pro code, to add some sophistication.

## 3. Copy files and run genesisInstall

Create a **new ref_data_app** folder inside the working folder that you created before starting, including **cfg** and **scripts** folders.

Copy the output files from the dictionary build to the **ref_data_app/cfg** folder inside the run directory.

Run `genesisInstall` to verify everything is ok.

![](/img/genesisinstall.png)


## 4. Prepare for pro code

### Build a Maven project

First, you need to build a Maven project so that you can use an IDE to build the app.

You can run the `mvn` command either locally (in the server, local vm, wsl or cloud instance where the LCNC Platform is installed) or a separate local dev machine. In our example below, we are using the same machine as before for consistency. Note that we are using version 5.5.0; adjust the command to match the version of the Genesis LCNC Platform that you are using.

Run the `mvn` command:

```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.5.0 -DartifactId=ref_data_app -B
```

This gives you the following project structure:

![](/img/maven-archetype-result.png)

### Move the files to the required location

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

```bash
[trading@dev-trading1 ref_data_app]$ cp /home/trading/run/ref_data_app/cfg/* ref_data_app-config/src/main/resources/cfg/
```

Locate the generated files for the request server, data server and event handler. These are in the **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.


```bash
[trading@dev-trading1 ref_data_app]$ cp /home/trading/run/ref_data_app/scripts/* ref_data_app-script-config/src/main/resources/scripts/
```

### Install the Maven project

Now run `mvn install`.

![](/img/build-maven-project-using-mvn-install.png)

Again, you need to move the script and config files. Have these to hand, so you can copy them easily:

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

Locate the generated files for the request server, data server and event handler. These are in the  **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.

### Install the Maven project in intellij

In intellij, run `mvn install`.

![](/img/run-maven-install-in-intellij.png)

That's it. You have all the files in a project, ready for you to work in your IDE. In the following steps, you'll be working here to add key functionality to the application.

<!-- TODO note skip to end via branching model -->
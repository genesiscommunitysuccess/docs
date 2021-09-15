---
id: reference-app
title: Generate the reference app
sidebar_label: Generate the reference app
sidebar_position: 1

---
The first task is to generate a reference application from the existing RDBMS of reference data.

Before you start. You need the genesis server platform installed in a server/local vm/wsl/cloud instance (genesis and auth).

Ideally, maven should be installed in the server instance with adequate configuration to retrieve genesis binaries.

Otherwise, the maven installation and configuration must be available in a local development environment.

There are four tables in the source relational database tables. You can see these  in DBeaver.

![](/img/dbeaver-screenshot.png)

## Generate the dictionary files

The **DictionaryBuilder** script reads the source database and generates the appropriate fields, tables and views in Genesis format. These are stored in two files:

* **-fields-dictionary.kts**
* **-tables-dictionary.kts**

Using the instance in which the platform is installed, run

**DictionaryBuilder -t MSSQL -U admin -P Password11 -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument**

This generates the **fields-dictionary.kts** and **tables-dictionary.kts** files for the data model.

![](/img/dictionary-builder-screenshot.png)

Check these files and adjust them to suit your application. For example, the process has translated the field ENABLED was as an INT type; you need to edit that to make it a BOOLEAN type.

Create a new ref_data_app folder structure inside GENESIS_HOME, including cfg and script folders

Copy the output files from the dictionary build to the **ref_data_app/cfg** folder inside the run directory.

Run **genesisInstall** to verify everything is ok.

![](/img/genesisinstall.png)

Run **AppGen** to build your three modules (event handler, request server and data server):

**AppGen -n ref_data_app -p 10000**

![](/img/appgen.png)

This gives you kts files for your new modules:

* scripts/ref_data_app-dataserver.kts
* scripts/ref_data_app-reqrep.kts
* scripts/ref_data_app-eventhandler.kts

and xml files for service definitions and prcoesses:

* cfg/ref_data_app-service-definitions.xml
* cfg/ref_data_app-processes.xml

Optionally, you could now run **remap**, which would give you cud operations for all the tables and request replies (static data from the request server), as well as for real-time data retrieval (via the data server.

But for this application, we are going to go into the pro code first, to add some sophistication. Build a maven project so that you can use an IDE to build the app.

### Build a maven project

You can run the **mvn** command either locally (in the server, local vm, wsl or cloud instance where the LCNC Platform is installed) or a separate local dev machine. In our example, we are using the same machine as before for consistency.

Run the **mvn** command:

**mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.1.2-RC -DartifactId=ref_data_app -B**

This gives you the following project structure:

![](/img/maven-archetype-result.png)

### Move the files to the required location

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

Locate the generated files for the request server, data server and event handler. These are in the  **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.

### Install the maven project

Now run **mvn install**.

![](/img/build-maven-project-using-mvn-install.png)

\**screengrab archetype generation in intellij

Again, you need to move the script and config files. Have these to hand, so you can copy them easily:

Move the generated **ref_data_app/cfg** files (from the previous DictionaryBuilder and AppGen steps) to the **ref_data_app-config/src/main/resources/cfg** folder.

Locate the generated files for the request server, data server and event handler. These are in the  **ref_data_app/scripts** folder. Move these to the **ref_data_app-script-config/src/main/resources/scripts** folder.

### Install the maven project in intellij

In intellij, run **mvn install**.

screengrab of result
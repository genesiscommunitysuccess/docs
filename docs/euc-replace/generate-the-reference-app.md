---
id: j-gen-refapp
title: Generate the reference app
sidebar_label: Generate the reference app

---
The first task is to generate a reference application from the exising RDBMS of reference data.

Before you start. You need the genesis server platform installed in a server/local vm/wsl/cloud instance (genesis and auth). 

Ideally, maven should be installed in the server instance with adequate configuration to retrieve genesis binaries. 

Otherwise, the maven installation and configuration must be available in a local development environment.

You can see the tables in the source relational database tables in DBeaver. 

\**dbeaver screenshot from Jose

Run DictionaryBuilder

Using the instance in which the platform is installed, run 

**DictionaryBuilder -t MSSQL -U admin -P Password11* -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument** 

This generates the **fields-dictionary.kts** and **tables-dictionary.kts** files for the data model. 

Check these files and adjust them to suit your application. For example, the process has translated the field ENABLED was as an INT type; you need to edit that to make it a BOOLEAN type. 

Create new ref_data_app folder structure inside GENESIS_HOME, including cfg and script folders 

Copy output files from dictionary builder to ref_data_app/cfg folder inside the run directory.  

Run genesisInstall to verify everything is ok. 

Run AppGen to build your three modules (eventhandler, request server and data server): 

AppGen -n ref_data_app -p 10000 

Using output folder /root/run/ref_data_app 

Writing file scripts/ref_data_app-dataserver.kts 

Writing file scripts/ref_data_app-reqrep.kts 

Writing file scripts/ref_data_app-eventhandler.kts 

Writing file cfg/ref_data_app-service-definitions.xml 

Writing file cfg/ref_data_app-processes.xml 

Optionally, you could now run remap, which would give you cud operations for all the tables and request replies (static data from the request server), as well as for real-time data retrieval (via the data server. 

But for this application, we are going to go into the pro code first, to add some sophistication. Build a maven project so that you can use an IDE to build the app.

You can run the mvn command either locally (in the server, local vm, wsl or cloud instance where the LCNC Platform is installed) or a separate local dev machine. In our example, we are using the same machine as before for consistency. 

Run the mvncommand:

mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.1.2-RC -DartifactId=ref_data_app -B 

This gives you the following project structure:

\**screengab from Jose

Move the generated ref_data_app/cfg files (from previous DictionaryBuilder and AppGen steps) to the ref_data_app-config/src/main/resources/cfg folder.

Move the generated ref_data_app/scripts files (request server, data server and event handler) to the ref_data_app-script-config/src/main/resources/scripts folder.

Build maven project with mvn install.  

Show archetype generation in intellij and repeat step 10) (have files at hand so we can copy them easily). 

Build maven project with mvn install in intellij
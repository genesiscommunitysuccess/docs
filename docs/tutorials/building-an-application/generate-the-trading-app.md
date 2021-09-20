---
id: trading-app
title: Generate the trading app
sidebar_label: Generate the trading app
sidebar_position: 2

---
Previously, we have created a reference data application from our original RDBMS database. This has a schema that we can use here.

Now we are going to create a trading application, based on the source spreadsheet.

## The source spreadsheet

Here is a look at the trades workbook that will form the basis of our trading application. The main sheet shows a list of trades:

![](/img/source-table.png)

## 1. Convert the spreadsheet

Using the instance in which the platform is installed, run **ExcelToGenesis**.

**ExcelToGenesis -f Trades.xlsx -n trading_app -t 11000**

This generates the **fields-dictionary.kts** and **-tables-dictionary.kts** for the data model.

![](/img/trading_app-creation-run-exceltogenesis-2.png)

Check and adjust the fields and tables

The fields and tables can be adjusted to suit your new app. For example, we can remove INSTRUMENT_ID and COUNTERPARTY_ID LATER ON when we add them to intellij, as our intellij project will be importing them from ref_data_app. Additionally we can tweak TRADE_ID to be a STRING and use a “sequence” definition to generate the fields

## 2. Run genesisInstall

The next step is to run **genesisInstall**, which will run checks and highlight any issues.

### Example of a fail (duplicated fields)

Let’s be practical here. Without changing the application, run **genesisInstall**.

This will fail because we have duplicate fields with the different field types.

![](/img/fail-duplicate-fields-and-tables.png)

Remove the following duplicated fields/tables:

* COUNTERPARTY_ID
* INSTRUMENT_ID
* COUNTERPARTY
* INSTRUMENT

![](/img/trading_app-creation-run-genesisinstall-remove-dupes-3-4.png)

![](/img/trading_app-creation-run-genesisinstall-remove-dupe-tables-1-4.png)

![](/img/trading_app-creation-run-genesisinstall-remove-dupe-tables-2-4.png)

![](/img/trading_app-creation-run-genesisinstall-remove-dupe-tables-1-4.png)

### A successful install

Run **genesisInstall** again.

![](/img/trading_app-creation-run-genesisinstall-again-5.png)

This time, we can see the files for the Genesis processes being created.

![](/img/trading_app-creation-run-genesisinstall-again-2-5.png)

## 3. Remap

The remap script creates the database schema from the dictionary files.

Run **remap -commit**.

![](/img/trading_app-creation-run-remap-commit-1-6.png)

![](/img/trading_app-creation-run-remap-commit-2-6.png)

## 4. Run AppGen

**AppGen** creates three important modules for the application:

* Event Handler
* request Server
* Data Server

Run **AppGen**:

**AppGen -n trading_app -p 11000**

![](/img/trading_app-creation-run-appgen-7.png)

## Load the trade data

To progress from here, we need to prepare a  pro-code setup, in this case a maven project. This will enable us to use an IDE to work at speed.

## Build a maven project

The **mvn** command can be run in either the server/local vm/wsl/cloud instance containing the genesis platform installation or a separate local dev machine. We will use the same machine as before for consistency.

Run

**mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.1.2-RC -DartifactId=trading_app -B**

![](/img/trading_app-creation-prepare-maven-project-10-11-12.png)

This gives you the following structure:

![](/img/trading_app-creation-show-project-structure-13.png)

Move the files to the correct location

Move the files that have been generated so far from the **trading_app/cfg** folder to trading_app-con_ig/src/main/resources/cfg_

Move the files from the **trading_app/scripts** folder (request server, data server and event handler) to the trading_app-script-config/src/main/resources/scripts

Build maven project with mvn install.

Show archetype generation in intellij and repeat step 10) (have files at hand so we can copy them easily).

Build maven project with mvn install in intellij
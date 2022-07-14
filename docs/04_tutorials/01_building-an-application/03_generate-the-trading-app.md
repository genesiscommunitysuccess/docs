---
id: positions-app
title: Generate the Positions app
sidebar_label: Generate the Positions app
sidebar_position: 3

---
We have already created a Reference Data module from our original RDBMS database, which will handle all reference data for instruments and counterparties. 

Now let's move on to the Market Data module, starting by building the trade table.

Once you have created both these modules, you will have a Positions app.

## The source spreadsheet

Here is a look at the trades workbook that will form the basis of our Market Data module. The main sheet shows a list of trades:

![](/img/source-table.png)

<!-- TODO link to the xlsx file download, docs or artifactory? -->


## 1. Convert the spreadsheet

<!-- TODO - run from intellij -->
<!-- TODO link to branch and repo -->
Using the instance in which the platform is installed, run `ExcelToGenesis`.

```bash
ExcelToGenesis -f Trades.xlsx -n trading_app -t 11000
```

This generates the **-fields-dictionary.kts** and **-tables-dictionary.kts** for the data model.

![](/img/trading_app-creation-run-exceltogenesis-2.png)

Check and adjust the fields and tables.

The fields and tables can be adjusted to suit your new application. For example, we can remove `INSTRUMENT_ID` and `COUNTERPARTY_ID` later on when we add them to Intellij, as our Intellij project will be importing them from the Reference Data module. Additionally, we can change `TRADE_ID` to be a `STRING` and use a `sequence` definition to generate the fields.

## 2. Run genesisInstall

The next step is to run `genesisInstall`, which will run checks and highlight any issues.

<!-- We should remove all this, too much info, move to run in intelliJ -->
### Example of a fail (duplicated fields)

Let’s be practical here. Without changing the application, run `genesisInstall`.

This will fail because, as you will see, we have some field names that conflict with field names in the existing schema (from the Reference Data module).

![](/img/fail-duplicate-fields-and-tables.png)

The point here is that this application and the Reference Data module that you created in the previous tutorial will share the same data model. 

You can't have two fields with the same name and a different type in a data model. Here, two fields from the workbook have been marked as duplicates, because there is already a field of the same name in the existing data model - which was created when you made the Reference Data module - but the field has a different type. Note that fields of the same name and type have caused no problems at all.

So, edit the file **trading_app-fields-dictionary.kts** that you have just generated from the Excel workbook. Remove the following duplicated fields:

* COUNTERPARTY_ID
* INSTRUMENT_ID

![](/img/remove-two-fields.png)

There is a similar issue with tables. So edit the file **trading_app-tables-dictionary.kts**. Remove the following duplicated tables:


* COUNTERPARTY
* INSTRUMENT

![](/img/remove-two-tables.png)

With these corrections, you are now ready to install again.

### A successful install

Run `genesisInstall` again.

![](/img/trading_app-creation-run-genesisinstall-again-5.png)

This time, we can see the files for the Genesis processes being created.

![](/img/trading_app-creation-run-genesisinstall-again-2-5.png)

## 3. Remap

The `remap` script creates the database schema from the dictionary files.

Run `remap --commit`.

![](/img/trading_app-creation-run-remap-commit-1-6.png)

![](/img/trading_app-creation-run-remap-commit-2-6.png)

## 4. Run AppGen

[The `AppGen` script](/managing-applications/operate/on-the-host/helpful-commands/#appgen) creates three important modules for the application:

* Event Handler
* Request Server
* Data Server

Run `AppGen`. Here we include the `-p` parameter, which numbers the port outputs from 11000 (in this case):

```bash
AppGen -n trading_app -p 11000**
```

![](/img/trading_app-creation-run-appgen-7.png)



To progress from here, we need to prepare a pro-code setup, in this case a Maven project. This will enable us to use an IDE to work at speed.

## 4. Build a Maven project

The `mvn` command can be run in either the server/local vm/wsl/cloud instance containing the Genesis platform, or on a separate local dev machine. For consistency, we shall use the same machine as before.

Run

```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DarchetypeVersion=5.5.0 -DartifactId=trading_app -B
```

![](/img/trading_app-creation-prepare-maven-project-10-11-12.png)

This gives you the following structure:

![](/img/trading_app-creation-show-project-structure-13.png)

### Move the files to the correct location

Move the files that have been generated so far from the **trading_app/cfg** folder to **trading_app-config/src/main/resources/cfg**.

Move the files from the **trading_app/scripts** folder (Request Server, Data Server and Event Handler) to the **trading_app-script-config/src/main/resources/scripts** folder.

### Install the Maven project

Now run `mvn install`.

Again, you need to move the script and config files. Have these to hand, so you can copy them easily:

1. Move the files that have been generated so far from the **trading_app/cfg** folder to **trading_app-config/src/main/resources/cfg**.

2. Move the files from the **trading_app/scripts** folder (Request Server, Data Server and Event Handler) to the **trading_app-script-config/src/main/resources/scripts** folder.

### Install the Maven project in Intellij

In intellij, run `mvn install`.

That's it. You have all the files in a project, ready for you to work in your IDE. In the following steps, you'll be working here to add key functionality to the application.

<!-- TODO link to branch and repo -->

<!-- TODO - do we need to explain adding to dictionary-cache? -->
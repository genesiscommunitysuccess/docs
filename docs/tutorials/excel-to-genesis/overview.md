---
id: overview
sidebar_label: 'Overview'
sidebar_position: 1
title: 'Excel to Genesis - a quick look'
---

Operational functions sitting in Excel workbooks is a common occurrence in the financial sector. And it sometimes includes functions that are mission-critical.

The Genesis LCNC Platform gives you a way of turning these into applications that can be audited and maintained in a standard and controlled manner. Along the way, you can build in better workflow and usability without heavy IT development effort.

In these pages, we shall look at a brief example.

## The starting point

In this example, we are going to start with a workbook that has ten different worksheets.

We shall analyse the workbook to check its contents, then run it through a conversion script.

From there, we shall make adjustments and complete the server.

Following this, we can build a web front-end that gives users a clear user interface.

## Analyse the workbook

When you analyse the existing workbook, there are some clear things to look out for.

### Structure

The content of each workbook is essentially a simple grid.

The simplest way to convert the workbook is to allow each separate workbook to become a table. This is the default.

### Functions

Genesis can turn the key Excel functions into kotlin code for use by your application. This covers a lot of use cases. At present, we cannot translate VBA code, (there is none of that in our example).

Decide how you want to calculate the functions that are not translated for you. If data is being loaded from an external source, then you probably want to perform the calculations in the server. If the database is maintained internally, then you might prefer to do the calculations in the front end and only commit to the server on Save.

[Functions converted by ExcelToGenesis](./excel-functions.md).

### Column headings

Column names will be turned into field names by the conversion process, which also analyses the content and allocates a field type for each one.

Long column headings do not make good field names. So, look at the headings in each sheet and replace the long ones with shorter text that makes better field names. It is quick to do this at the start than to wait until after the conversion.

You can now use this compliant version of the xls to start the conversion process.

## Convert the workbook

This is a simple command that produces a Genesis data model very quickly. The syntax is:

**ExcelToGenesis**

Options

| Argument | Argument long name      | Mandatory |               Description                                 | Restricted values         |
|----------|-------------------------|-----------|-----------------------------------------------------------|---------------------------|       
| -f       | --file                  | Yes       | the name of the worksheet you are going to convert.       | No                        |        
| -n       | -–name                  | Yes       | the name of the project (application) you want to create. | No                        |              
| -t       | -–table                 | Yes       | the start of the table id sequence (see note below)       | No                        |        

:::note 

each table is automatically given a unique numeric ID. Supply the opening sequence number, for example, 10000. Numeric IDs enable you to change the name of a table without losing the data.

::: 

So, for our example, we are going to run:

```bash
ExcelToGenesis -f euc\\ demo\\ cash\\ mgmt.xlsx -n cash -t 10000
```

The process is quick.It creates a number of tables and dictionaries using the application name you supplied.

This is what it gives us:

![](/img/the-command-and-what-it-gives-you.png)

The conversion has created a folder called **`/home/core/run/cash.cfg`**. This contains:

* The field definitions are in the file `cash-fields-dictionary.kts`
* The table definitions are in the file `cash-tables-dictionary.kts`
* The views definitions are in the file `cash-view-dictionary.kts`
* There 10 files of data. The data from each worksheet has been extracted to a separate csv file.

### The Fields file

Inside the file `cash-fields-dictionary.kts`, you can see all the fields that have been defined.

![](/img/fields-table.png)

The fields are automatically sampled by the command to allocate a type. If it is not sure, it allocates a the field as STRONG. Most of these will be correct, but you will need to handle exceptions.

Note that our example contains some long field names. Ideally, these should be shortened before the conversion process, but these long field names still work.

Illegal characters in field names have been automatically converted. You can see here that the % sign has been changed to PERCENT.

![](/img/percent-has-been-changed.png)

### The tables file

Inside the file `cash-tables-dictionary.kts`, the source of each table is included as a comment at the beginning.

![](/img/tables.png)

Table IDs are sequential from the first one created, starting with the `-t` number supplied.

Each field in the table has a comment showing the column it came from, as well as relevant notes on the function (e.g aggregation).

If the conversion process was not able to parse a field, this is clearly marked on the comment.

![](/img/unable-to-parse.png)

You will have to deal with this, perhaps by creating a consolidator.

The first column in each worksheet is always  used as the primary key for the table.

\**Note that it has handled a concatenation, where the primary key is created from the first two columns.

### The Views file

Inside the file `cash-view-dictionary.kts`, you can see that the script has been able to find where tables need joins. Exceptions are highlighted.

In the example here, the first worksheet has been converted. This has created a view with two joins successfully. But it has not been possible to create a third join:

![](/img/views-2.png)

The conversion has created derived fields - simple calculations based on other fields in the view. Our example includes both IF statements and VAL.

![](/img/views-derived-fields-2.png)

### The data files

Here is a look at part of one of the 10 csv files created.

![](/img/csv-cropped.png)

You can use the **sendIt** command to load the data into the application's database.

## Creating the application from the data model

After you have checked the files generated and addressed any issues in the fields, tables and views, you can run the sequence of commands to generate an application.

1. Run `genesisInstall` to check all the config files and prepare the application for the current environment (using the files in site-specific to replace values in the modules, for example).
2. Run `remap --commit` to set any changes to the database (modifications to fields, tables and views).
3. Run `AppGen` to generate event handlers,  request servers and data servers for all the tables. For example:

```bash
    AppGen -n cash -p 10000
```

This creates,

* the kts files for the event handlers, request servers and data servers
* the service definitions
* the process definitions

![](/img/built-by-appgen.png)

Run `genesisInstall` again to install these changes.

You now have a basic application. The event handler, the request server and the dataserver only provide the simplest functions, but the data is exposed so that a front end can be created and connected. The event handler, for example, provides very simple insert, modify and delete events.

If you want to add validation at this stage, for example, you could edit the code to add it.
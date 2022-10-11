---
title: 'Excel reference'
sidebar_label: 'Excel reference'
id: excel-reference
---

[Excel reference](/server/integration/excel-to-genesis/excel-reference/)  | [Excel functions](/server/integration/excel-to-genesis/excel-functions)

The Genesis low-code platform enables you to convert existing Excel spreadsheets into Genesis data models. 

The process of conversion handles the [functions](#functions), [columns/field names](#column-headings-and-field-names), [tables](#the-tables-file) and much more. All the logic for conversion is structured around these areas. 


## ExcelToGenesis

This script converts the Excel spreadsheet into a Genesis data model, which can then be used to generate a working server.

### Options

| Argument | Argument long name      | Mandatory |               Description                                 | Restricted values         |
|----------|-------------------------|-----------|-----------------------------------------------------------|---------------------------|       
| -f       | --file                  | Yes       | the name of the worksheet you are going to convert.       | No                        |        
| -n       | --name                  | Yes       | the name of the project (application) you want to create. | No                        |              
| -t       | --table                 | Yes       | the start of the table id sequence (see note below).      | No                        |        



Each table is automatically given a unique numeric ID. Supply the opening sequence number, for example, 10000. Numeric IDs are useful because they enable you to change the name of a table without losing the data.

By default, the conversion process will convert each separate worksheet into a table.


### Functions

The conversion script turns Excel functions in the named workbook into Kotlin code. The [most common Excel functions](/server/integration/excel-to-genesis/excel-functions/) are all covered.


### Column headings and field names

The conversion process turns Excel column names into Genesis field names. It analyses the content of the column to determine the field type of each fieldd.

The fields are automatically sampled by the command to allocate a type. If there is ambiguity, it sets the field as STRONG.

:::info
It is recommended that you shorten long column headings before you make the conversion. In general, you want short and usable field names in your data model. It is quicker to do this **before** running the script, rather than editing the fields dictionary and other files that are generated.
:::

### Files created
The conversion creates a folder called `/home/core/run/_name_.cfg` where _name_ is the application name specified in the script. This contains:

* The field definitions are in the file `_name_-fields-dictionary.kts`
* The table definitions are in the file `_name_-tables-dictionary.kts`
* The views definitions are in the file `_name_-view-dictionary.kts`
* The data from each worksheet is extracted to a separate csv file.


### The tables file
In the Tables file, the source of each table is included as a comment at the beginning.


Table IDs are sequential from the first one created, starting with the `-t` number supplied.

Each field in the table has a comment showing the column it came from, as well as relevant notes on the function (e.g aggregation).

If the conversion process is not able to parse a field, this is clearly marked on the comment. You can then troubleshoot these manually.

![](/img/unable-to-parse.png)

The first column in each worksheet is always used as the primary key for the table.

### The view file

The script automatically finds where joins are required. Inside the **view** file, any exceptions are highlighted.

The conversion can create derived fields where these are simple calculations based on other fields in the view. 

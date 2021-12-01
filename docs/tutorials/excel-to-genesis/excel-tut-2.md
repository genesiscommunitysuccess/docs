---
id: excel-tut-2
sidebar_label: 'Analyse, adjust & run'
sidebar_position: 20
title: 'Analyse, adjust and run'
---



We are going to start with a workbook that has ten different worksheets.

![](/img/narrow-xls.png)


## Analyse the workbook

When you analyse the workbook, there are some clear things to look out for.

### Structure

The content of each sheet in our source workbook is essentially a simple grid.

By default, the conversion process will convert each separate worksheet into a table. That works well for the workbook we have here.

### Functions

The conversion script will turn the Excel functions in the workbook into kotlin code. for use by your application. The most [common Excel functions](/platform-reference/integrations/external-systems/exceltogenesis/excel-functions/) are all covered. 


### Column headings

Column names will be turned into field names by the conversion process, which also analyses the content and allocates a field type for each one.

Long column headings do not make good field names. So, look at the headings in each sheet and replace the long ones with shorter text that makes better field names. It is quicker to do this at the start than to wait until after the conversion.

For example, it would help to change this long name to **Cpty_Base_Adj_Collat_Val**:

![](/img/adjust-field-name.png)


## Convert the workbook

Once you have adjusted the column headings, you can run the conversion process:

```bash
ExcelToGenesis -f euc\\ demo\\ cash\\ mgmt.xlsx -n cash -t 10000
```

The process is quick. It creates a number of tables. Each table has a numeric ID, starting with the number 10000 that you supplied in the command. The dictionary files produced all include the product name **Cash**, which you supplied with the command.

OK. Now [look at the results](/tutorials/excel-to-genesis/excel-tut-3/).


---
title: 'Server Commands'
sidebar_label: 'Server Commands'
id: server-commands
---

Genesis has numerous built-in commands that have their own individual functions.
This page goes through them and details the function, parameters and use cases of those commands. 
## RenameFields script
This script is used to rename a field name in a database without changing the dictionary or config files.

### Syntax
The `RenameFields` script takes two arguments; both of which are mandatory:

```bash
RenameFields [-i <[current name of field]>] [-o  <[new name of field]>]
```

| Argument | Argument long name | Mandatory | Description                              | Restricted values |
|----------|--------------------|-----------|------------------------------------------|-------------------|
| -i       | --input            | yes       | name of field that you want to change    |                   |
| -o       | --output           | yes       | name you want the field to be changed to |                   |



The `--input` argument represents the name of the field you would like to change. The argument must be an existing field name in the database.
The `--output` argument represents the name of the field you would like to change to. The argument must also be an existing field name in the database.
Both arguments must also be of the same type.
If both arguments are in the same table, it would result in the `--output` field being deleted.
All changes using `RenameFields` can be changed back to the original database schema by using the command `remap --commit`.

For example:

```bash
RenameFields -i SYMBOL -o TRADE_ID
```

This changes the name of SYMBOL field to TRADE_ID.     

Another example:

```bash
RenameFields --input FIRST_NAME --output FNAME 
```

This changes the name of the field FIRST_NAME to FNAME

Invalid example:

```bash
RenameFields -i PRICE -o FIRST_NAME
```

This would result in an error as PRICE is of type DOUBLE while FIRST_NAME is of type STRING.
The following error will be logged:
`The following input -> output fields don't have matching attributes:`

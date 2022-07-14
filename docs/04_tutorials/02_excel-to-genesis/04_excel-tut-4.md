---
id: excel-tut-4
sidebar_label: 'Generate the app'
sidebar_position: 4
title: 'Generate the application'
---






After you have checked the files generated and addressed any issues in the fields, tables and views, you can run the sequence of commands to generate an application.

1. Run `genesisInstall` to check all the config files and prepare the application for the current environment (using the files in site-specific to replace values in the modules, for example).
2. Run `remap --commit` to set any changes to the database (modifications to fields, tables and views).
3. Run `AppGen` to generate event handlers,  request servers and data servers for all the tables. For example:

```bash
    AppGen -n cash -p 10000
```

This creates an application called **Cash** with:

* the kts files for the  [Event Handler](/tutorials/excel-to-genesis/Files/excel-tut-5/), [request server](/tutorials/excel-to-genesis/Files/excel-tut-6/) and [data server](/tutorials/excel-to-genesis/Files/excel-tut-7/)
* the [service definitions](/tutorials/excel-to-genesis/Files/excel-tut-10/)
* the [process definitions](/tutorials/excel-to-genesis/Files/excel-tut-9/)

![](/img/built-by-appgen.png)

Run `genesisInstall` again to install these changes.

You now have a basic server that you can access from a web front-end. The Event Handler, the request server and the dataserver only provide the simplest functions, but the data is exposed so that a front end can be created and connected. The Event Handler, for example, provides very simple insert, modify and delete events.

Of course, this is really just a beginning - you can go into the code and introduce all kinds of sophistication.

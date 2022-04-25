---
id: installhooks
sidebar_label: 'Install Hook'
sidebar_position: 3
title: 'Install Hook'
---

## Install hook
Install hooks run as part of genesisInstall. If you want to run any scripts as part of genesisInstall then add those scripts to {applicationName}_config/resources/scripts/installHooks, where applicationName is the name of application you are developing. These hooks run only once during genesisInstall when genesis-server starts, any successive execution of genesisInstall won't execute installHooks or its idempotent
On server it will be present at GENESIS_HOME/{applicationName}/scripts/InstallHooks directory and logs are present at GENESIS_HOME/runtime/installHooks

Install hook file name conventions:
- Install hook name needs to be unique
- It needs to contain priority number at the beginning of the file name and number should unique 
- Example: 1_migrateLogFiles.sh, 2_migrateDictionary.sh

## Example

We have migration script called migrateDictionary.sh as install hook which internally executes [MigrateDictionary](/managing-applications/operate/on-the-host/helpful-commands/#migratedictionary)

```shell
#!/bin/bash

MigrateDictionary -dst DB

exit $?
```

You can create new script and add under the folder mentioned above to perform any particular functionality as part of genesisInstall
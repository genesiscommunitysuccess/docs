---
id: installhooks
sidebar_label: 'Install Hook'
sidebar_position: 3
title: 'Install Hook'
---

## Install hook
Install hooks run as part of genesisInstall. If you want to run any scripts as part of genesisInstall then add those scripts to the file  *applicationName*_**config/resources/scripts/installHooks**, where *applicationName* is the name of application you are developing. 

The scripts (hooks) you add will only run once, unless their execution fails. If you run `genesisInstall`again, previously successful executions of installHook scripts will not be run as part of the install. 

The scripts must be implemented to work in an idempotent way, and the end result of executing a script means the system is (or already was) in the expected target state, whether you run it on a pre-existing environment (e.g. upgrading a server) or you run it in a completely new environment.

On the server, it is located in the GENESIS_HOME/*applicationName*/**scripts/installHooks** directory. Logs are located in **GENESIS_HOME/runtime/installHooks**

Install hook file-name conventions:
- The install hook name must be unique.
- It needs to contain a priority number at the beginning of the file name. This number should be unique.
Example: 1_migrateLogFiles.sh, 2_migrateDictionary.sh
- If you need to create a new install hook that has to execute before priority number 1 or number 2, you can increase the numbers for all the other scripts (e.g. rename 1_migrateLogFiles.sh to be 9_migrateLogFiles.sh)

## Example

You can create a new script and add it in  the folder mentioned above to perform any particular functionality as part of `genesisInstall`.

Any script exiting with value "0" is considered successful by the installHooks system, and any script exiting with a non-zero value is considered to have failed execution. 

In a Java or Kotlin world, a simple implementation could look like this:

```kotlin
@JvmStatic
fun main(args: Array<String>) {
    ScriptUtils.initRootLogLevel(Level.WARN)

    val genesisHome = System.getenv("GENESIS_HOME")

    if (genesisHome == null || "" == genesisHome) {
        val message = "System environment variable GENESIS_HOME is not set. Aborting migration process..."
        // installHooks FAILURE
        System.err.println(message)
        exitProcess(1)
    }

    try {
        run(args)
        // installHooks SUCCESS
        exitProcess(0)
    } catch (e: Exception) {
        // installHooks FAILURE
        System.err.println(e.message)
        exitProcess(1)
    }
}
```

Consider another example: we have a migration script called migrateDictionary.sh as an install hook; this internally executes [MigrateDictionary](/managing-applications/operate/on-the-host/helpful-commands/#migratedictionary) as shown below:

```shell
#!/bin/bash

MigrateDictionary -dst DB

exit $?
```


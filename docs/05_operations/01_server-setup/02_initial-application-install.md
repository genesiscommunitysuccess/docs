---
title: 'Server set-up - initial application installation'
sidebar_label: 'Initial application install'
sidebar_position: 2
id: initial-application-install
keywords: [operations, server, setup, initial, application, install]
tags:
    - database
    - server
    - setup
    - initial
    - application
    - install
---
This section describes installing an application built on the Genesis low-code platform.  Readers need to have some experience of Linux system administration .

## Installing build artifacts

### Transferring the build artifacts

After a build process is finished, the result is a set of build artifacts ready to be installed.  At present, Genesis applications are built as ZIP files ready to be copied to and unzipped on the target host(s). The application's developer can advise which are the correct ZIP files.

Copy the build artifact onto the host by whatever means your local security policies allow.  

## Installing code

The build artifact is unlikely to contain absolute paths for its files, so it is important to have the correct extract directory when unzipping them.

You can use the `zipinfo` command (part of the unzip package) to examine the files inside the ZIP. 

Below is sample output for part of a distribution ZIP. Your application will probably have a different top-level directory; typically, this is named after the application.

```shell
$ zipinfo genesis-distribution-6.1.0-bin.zip 
Archive:  genesis-distribution-6.1.0-bin.zip
Zip file size: 234214088 bytes, number of entries: 573
drwxr-xr-x  2.0 unx        0 b- defN 22-Jul-10 16:24 genesis/
drwxr-xr-x  2.0 unx        0 b- defN 22-Jul-10 16:24 genesis/bin/
-rw-r--r--  2.0 unx   118037 b- defN 22-Jul-10 16:04 genesis/bin/genesis-consolidator2-6.1.0.jar
-rw-r--r--  2.0 unx   531691 b- defN 22-Jul-10 16:04 genesis/bin/genesis-cluster-6.1.0.jar
-rw-r--r--  2.0 unx   101884 b- defN 22-Jul-10 16:24 genesis/bin/genesis-webmon-6.1.0.jar
(and more)
```

## Application paths

The default application install path for Genesis-built applications is chosen to divide the application up (for when more than one application is installed on a host) and to manage versions.  

For portability, Genesis application artifacts represent complete installs, with everything needed placed inside one directory tree.

The default path for server-side code is generated as follows:

```shell
installDate=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

# make the server directory and maintain a symlink in the runUser's homedir
mkdir -p /data/${runUser}/server/${installDate}/run
rm -f /home/${runUser}/run
ln -s /data/${runUser}/server/${installDate}/run /home/${runUser}/run
```

The web code is served up by nginx, and so it is installed separately from the server-side code.  The default path for
the web code is generated as follows:

```shell
installDate=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

# make the directory and create a stable path for the nginx document root
mkdir -p /data/${runUser}/web-${installDate}
rm -f /data/${runUser}/web
ln -s /data/${runUser}/web-${installDate} /data/${runUser}/web
```

## Unzipping the code

### Application code

The ZIP files will contain relative paths, so the extract path matters. Therefore, either `chdir` to the correct
directory, or use a command-line argument to unzip.

```shell
installDir=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/server/${installDate}/run; unzip <absolute path to application ZIP>

# OR

unzip <absolute path to application ZIP> -d /data/${runUser}/server/${installDate}/run
```

### Web code

The web ZIP is also likely to contain relative paths, so again, the extract path matters.  Therefore, either `chdir` to
the correct directory, or use a command-line argument to unzip.

```shell
installDir=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/web-${installDate}; unzip <absolute path to web ZIP>

# OR

unzip <absolute path to web ZIP> -d /data/${runUser}/web-${installDate}
```


## Installing site-specific configuration

The final build artifact is the configuration for the run environment. There are two options here:

- separate config, where only the given environment config is provided
- unified config, where each separate environment is specified in the
config

Each approach has its virtues.  Separate config maintains separation between environments.  Unified config provides a single artifact for all environments (this helps to confirm that what is live is what was tested).

This is also a ZIP file, containing relative paths (the top-level directory is always **site-specfic**).

This needs to be installed in the server-side code directory, following a very similar pattern to installing the
server-side code.

```shell
installDir=$(date %Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/server/${installDate}/run; unzip <absolute path to site-specific ZIP>

# OR

unzip <absolute path to site-specific ZIP> -d /data/${runUser}/server/${installDate}/run
```

## Post-install tasks

Any last changes to the configuration files should be made before proceeding.  Whether the site-specific config provides a complete configuration set is a matter that needs to be agreed between the developer and the system administrator.

If anything cannot be determined at site-specific ZIP build time, it might need to be changed manually on the host.

Following this, two key Genesis commands must be run to complete the installation. Both must be run as the application user, as they will generate files with the ownership of the user running the command.

- The command `genesisInstall` creates a set of files, consolidating config to create a unified view of it, which the processes will consume. It is needed after an install or an upgrade. For more details, see the [commands reference](/operations/commands/server-commands/#genesisinstall-script).

- The command `remap --commit` handles the data model, and thus the database schema. Its purpose is to generate DAO (data access object) classes and apply the data model schema to the database. For more details, see the [commands reference](/operations/commands/server-commands/#remap-script).






---
id: initial-application-install
title: 'Initial Application Install'
sidebar_label: 'Initial Application Install'
sidebar_position: 2

---
This document describes installing an application built with Genesis frameworks.  It is written for a reader with some
Linux system administration experience.

## Installing build artifacts

### Transferring the build artifacts

After a build process is finished, the result is a build artifacts ready to be installed.  At present, Genesis
framework applications are build as ZIP files ready to be copied to and unzipped on the target host(s).  The
application's developer will be able to advise which is the correct ZIP files.

Copy the build artifact onto the host by whatever means local security policies allow.  

### Installation of code

The build artifact is unlikely to contain absolute paths for its files, so it is important to have the correct extract
directory when unzipping them.

You can examine the files inside with the 'zipinfo' command (part of the unzip package).  This is sample output for
part of the Genesis framework distribution ZIP (actually used during application build).  Individual applications
may have a different top level directory, named after the application.

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

#### Application paths

The default application install path for Genesis built applications is chosen to divide the application up (for when more
than one application is installed on a host) and to manage versions.  For portability, Genesis application artifacts
represent complete installs, including everything they need inside one directory tree.

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

### Unzipping the code

#### Application code

Given the ZIP files will contain relative paths, the extract path matters.  Therefore, either chdir to the correct
directory, or use a command-line argument to unzip.

```shell
installDir=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/server/${installDate}/run; unzip <absolute path to application ZIP>

# OR

unzip <absolute path to application ZIP> -d /data/${runUser}/server/${installDate}/run
```

#### Web code

The web ZIP is also likely to contain relative paths, so again, the extract path matters.  Therefore, either chdir to
the correct directory, or use a command-line argument to unzip.

```shell
installDir=$(date +%Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/web-${installDate}; unzip <absolute path to web ZIP>

# OR

unzip <absolute path to web ZIP> -d /data/${runUser}/web-${installDate}
```


### Installation of site-specific configuration

The final build artifact is configuration for the running environment.  Genesis supports both separate config, where
only the given environment config is provide, or unified config, where each separate environment is specified in the
config.

Each approach has its virtues.  Separate config maintains separation between environments.  Unified config provides a
single artifact for all environments (this helps to confirm that what is live, is what was tested).

This is also a ZIP file, containing relative paths (the top-level directory is always "site-specfic").

This needs to be installed in the server-side code directory, following a very similar pattern to installing the
server-side code.

```shell
installDir=$(date %Y%m%d)
runUser=<provide the username the application will run as>

cd /data/${runUser}/server/${installDate}/run; unzip <absolute path to site-specific ZIP>

# OR

unzip <absolute path to site-specific ZIP> -d /data/${runUser}/server/${installDate}/run
```

### Post-install tasks

Any last changes to the configuration files should be made before proceeding.  Whether the site-specific config
provides a complete configuration set is a matter for the developer and the system administrator providing the
developer with all necessary information.

If anything cannot be determined at site-specific ZIP build time, it may need manual change on the host.

Following this, several Genesis commands must be run to complete the installation.  Both must be run as the application
user, as they will generate files with the ownership of the user running the  command.

The command `genesisInstall` will create a set of files, consolidating config to create a unified view of it, which the
processes will consume.  It is needed after an install or an upgrade.

The command `remap --commit` handles the data model, and thus database schema.  It has some arguments that control its
behaviour  but its purpose is to generate DAO (data access object) classes and apply the data model schema to the
database.






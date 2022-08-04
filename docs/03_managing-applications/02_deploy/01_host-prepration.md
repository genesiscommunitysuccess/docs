---
id: host-preparation
title: Host Preparation
sidebar_label: Host Preparation
sidebar_position: 1

---
This document describes preparing a host to run applications built with Genesis frameworks.  It is written for a
reader with some Linux system administration experience.


## OS Choice

Genesis runs a set of JVM processes and a few external pieces of software, notably [nginx](https://nginx.org/en/).  It
requires (in all likelihood) one of a set of supported databases and Genesis Global can provide RPM packages for them
if required.  Our existing build pipeline favours producing either ZIP files or RPM packages.  As such, Genesis Global
recommends an OS from the RedHat family, either CentOS 7 or RHEL 7.  We have seen good results with AmazonLinux 2.

Choosing a different Linux variant will require the operator to locate suitable packages to install database and other
software packages.

## Processes and dependencies

For applications built with Genesis frameworks, there are some dependencies that any running host must meed.

Genesis applications include both server-side and web code.  The server-side processes are Java and Kotlin.  The web
framework is built as NPMs and web application code is served to the client by the server.

### Java / Kotlin

Genesis recommends [openjdk-11](https://openjdk.org/projects/jdk/11/) as the runtime.  _Note_ the JRE is not
sufficient, as installation of Genesis applications includes steps to configure the applications.

* java-openjdk-11

### Third-party software

Other packages needed to manage and run Genesis applications are:

* nginx
* unzip
* lmdb

### Databases

Genesis supports several types of database; application developers are free to choose with the constraint of which
choices make sense in your environment.  The currently supported list is:

* [FoundationDB](https://www.foundationdb.org/) (default)
* [Aerospike](https://aerospike.com/)
* [PostgreSQL](https://www.postgresql.org/) (local or RDS within AWS)
* [MSSQL](https://www.microsoft.com/en-gb/sql-server/sql-server-2016) (Windows environments)
* [Aurora](https://aws.amazon.com/rds/aurora/) (AWS environments)


#### Installing FoundationDB

FoundationDB compatible versions are available from Genesis' Artifactory at
[a suitable path](https://genesisglobal.jfrog.io/artifactory/genesis-rpm/$releasever/$basearch/).

If resilient FoundationDB is required, it can be clustered across multiple hosts (an odd number of instances are
needed for safety).   Details of setup can be found in FoundationDB's
[documentation](https://apple.github.io/foundationdb/administration.html).


## Specific preparations

The default installation location for Genesis applications is inside /data, which may or may not be created by your OS
install.  If it is not, it should be created mode 0644 as non-root users' data will be written inside and thus it will
need to be readable.

Genesis applications typically run as a non-root user (for a spectrum of reasons, largely security-related).  The
exact choice of user is in the control of the operator of the host.  Genesis currently recommends a separate user per
application on a host - _multiple applications sharing running as one user creates some difficulties in development
and operation_.

During installation the username for the application is used to set the file ownership and startup scripts' behaviour
and a symlink will be created in the user's home directory.  Creation of user home directories should therefore not be
disabled.


## How many hosts, how big?

Genesis applications will run quite happily within one host, provided enough CPU and memory are present (we recommend
a minimum of 16GB and 32GB is better; CPU demands vary greatly by application, and idle applicaitons consume very
little CPU).

Resilience options involve some customization of setup and our framework will integrate with
[Consul](https://www.consul.io/) to handle multi-host setups.  Some larger Genesis-built projects have spread out
across more than a dozen hosts to accomplish scaling and resilience.  Consul at a known-good version can also be
downloaded from our Artifactory at the link above.

Clustering is native to Genesis applications and the details of configuring it are covered
[later](/managing-applications/operate/clustering/clusters).

Disk space required is very application dependent.  Genesis applications will by default log locally; log volumes are
determined by application activity levels.  Genesis applications also use local disk to create local LMDB files to help
coordinate data.  These are mmap()'d by the processes and writes are coalesced by the Linux kernel, so iops are kept
low, but it is still affected by application activity.

If the chosen database is help locally, this also affects disk requirements.  Data volumes also depend greatly on the
application; Genesis framework requires very little for itself.  Consult with your application developers on the
anticipated data volumes.


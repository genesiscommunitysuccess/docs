---
title: 'Server set-up - preparing the host'
sidebar_label: 'Host preparation'
sidebar_position: 1
id: host-preparation
keywords: [operations, server, setup, preparation]
tags:
    - database
    - server
    - setup
    - preparation
---
This section describes preparing a host to run applications built with the Genesis low-code platform.  Readers need to have some experience of Linux system administration.


## OS choice

Genesis runs a set of JVM processes and a few external pieces of software, notably [nginx](https://nginx.org/en/). It requires (in all likelihood) one of a set of supported databases; Genesis Global can provide RPM packages for them, if required. 

Our existing build pipeline favours producing either ZIP files or RPM packages. We recommend an OS from the RedHat family: either CentOS 7 or RHEL 7. We have seen good results with AmazonLinux 2.

Choosing a different Linux variant will require the operator to locate suitable packages to install database and other software packages.

## Processes and dependencies

For applications built on the platform, there are some dependencies that any running host must meet.

Genesis applications include both server-side and web code.  

- The server-side processes are Java and Kotlin.  
- The web framework is built as NPMs, and web application code is served to the client by the server.

### Java/Kotlin

Genesis recommends [openjdk-11](https://openjdk.org/projects/jdk/11/) as the runtime. Note that the JRE is not sufficient, as installation of Genesis applications includes steps to configure the applications.

* java-openjdk-11

### Third-party software

Other packages needed to manage and run Genesis applications are:

* nginx
* unzip
* lmdb

### Databases

Genesis supports several types of database. The currently supported list is:

* [FoundationDB](https://www.foundationdb.org/) (default)
* [Aerospike](https://aerospike.com/)
* [PostgreSQL](https://www.postgresql.org/) (local or RDS within AWS)
* [MSSQL](https://www.microsoft.com/en-gb/sql-server/sql-server-2016) (Windows environments)
* [Oracle](https://www.oracle.com/uk/database/)
* [Aurora](https://aws.amazon.com/rds/aurora/) (AWS environments)


### Installing FoundationDB

FoundationDB compatible versions are available from the Genesis Artifactory at[a suitable path](https://genesisglobal.jfrog.io/artifactory/genesis-rpm/$releasever/$basearch/).

If resilient FoundationDB is required, it can be clustered across multiple hosts. An odd number of instances are needed, for safety.  Details of set-up can be found in FoundationDB's
[documentation](https://apple.github.io/foundationdb/administration.html).


## Specific preparations

The default installation location for Genesis applications is inside **/data**, which might not be created by your OS install. If it is not, it must be created mode 0644, as non-root users' data will be written inside, and thus it needs to be readable.

Genesis applications typically run as a non-root user (for a spectrum of reasons, largely security-related). The exact choice of user is in the control of the operator of the host. Genesis currently recommends a separate user per application on a host; _multiple applications running as one user creates some difficulties in development and operation_.

During installation, the username for the application is used to set the file ownership and the behaviour of the start-up scripts. A symlink is created in the user's home directory.  Therefore, you must not disable the creation of user home directories.


## How many hosts, how big?

Genesis applications can run quite happily within one host, provided enough CPU and memory are present (we recommend
a minimum of 16GB and 32GB is better; CPU demands vary greatly by application, and idle applications consume very little CPU).

Resilience options involve some customisation of set-up; the platform can integrate with [Consul](https://www.consul.io/) to handle multi-host setups. Some larger Genesis-built projects have spread out across more than a dozen hosts to accomplish scaling and resilience. Consul at a known-good version can also be downloaded from our Artifactory using the link above.

Clustering is native to Genesis applications and the details of configuring it are covered in our section on [Clustering](/operations/clustering/clusters).

Disk space required is very application-dependent. Genesis applications log locally by default; log volumes are determined by application activity levels.  Genesis applications also use local disk to create local LMDB files to help coordinate data. These are mmap()'d by the processes. Writes are coalesced by the Linux kernel, so iops are kept low, but disk usage is still affected by application activity.

If the chosen database is held locally, this also affects disk requirements. Data volumes also depend greatly on the application; the platform requires very little for itself. Consult your application developers on the anticipated data volumes.


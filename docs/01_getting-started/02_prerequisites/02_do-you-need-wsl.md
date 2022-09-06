---
title: 'Do you need WSL?'
sidebar_label: 'Do you need WSL?'
id: do-you-need-wsl
---

If you don't have a Linux box for running your Genesis platform, you can use Windows Subsystem for Linux (WSL2) to install a Linux environment on your Windows machine.

The Windows Subsystem for Linux enables you to run a GNU/Linux environment - including most command-line tools,
utilities, and applications - directly on Windows, unmodified, without the overhead of a virtual machine or
dual-boot setup.

In short, if your development environment is Windows, we recommend installing WSL2.

The recommended Linux OS is CentOS7. Here is how to set it up.


## Setting up

### Install Windows Terminal

If you haven’t already, please install [Windows Terminal](https://www.microsoft.com/store/productId/9N0DX20HK701). This provides a tabbed single Window from which you can open different command line tools.

### Install WSL2

Your Windows install must be 2004+ ([2020 May feature release or higher](https://support.microsoft.com/en-us/topic/windows-10-update-history-24ea91f4-36e7-d8fd-0ddb-d79d9d0cdbda)).

If you have previously enabled WSL, you need to set the default version to 2 and (optionally) convert existing distros:

```none title="PowerShell"
> wsl -l -v
  NAME      STATE           VERSION
* Ubuntu    Stopped         1
> wsl --set-default-version 2
For information on key differences with WSL 2 please visit https://aka.ms/wsl2
> wsl --set-version Ubuntu 2
Conversion in progress, this may take a few minutes...
For information on key differences with WSL 2 please visit https://aka.ms/wsl2
Conversion complete.
> wsl -l -v
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

### Install Ubuntu

Available in the Microsoft App store, the [Ubuntu app](https://www.microsoft.com/store/productId/9PDXGNCFSCZV) utilises
WSL2 and enables you to open an Ubuntu terminal, which helps with Microsoft's guide on installing CentOS7 (in the section
below).


### Install Docker Desktop for Windows

Later on, you are going to need Docker in order to start your database. Also, depending on which route you choose, you might want Docker in order to Install CentOS7.

For instructions on how to install, see the [Docker documentation](https://docs.docker.com/docker-for-windows/). For a
download, [click here](https://hub.docker.com/editions/community/docker-ce-desktop-windows/).

Ensure that you have the WSL2 integration enabled and that you have enabled integration with your CentOS distribution. This enables you to access the Docker command, as well as any Docker container from any of the integrated distros, as well as from Windows.

To check this setting, open the Docker Desktop, then go to **Settings** > **Resources** > **WSL
Integration**.

### Install CentOS7 for WSL2

WSL distributions can be found easily at various locations on the web. For instance, here is a [prebuilt WSL CentOS7
distro](https://github.com/mishamosher/CentOS-WSL/releases/download/7.9-2111/CentOS7.zip).

To install this distro, unzip and execute the .exe

For an alternative and expedient way to install CentOS7, you can use the Microsoft article below in order to build a CentOS distro from a Docker image.

:::caution Important

Note that you want to install CentOS7, whereas the microsoft article below focuses on CentOS latest.

Replace
`# docker run -t centos bash ls/`

with
`# docker run -t centos:centos7 bash ls/` 

for the third step under **Export the tar from a container**.

:::

You can find the Microsoft article to install CentOS [here](https://docs.microsoft.com/en-us/windows/wsl/use-custom-distro).

Once you have installed CentOS, close your Windows Terminal then reopen it. Note the new entry in the drop-down menu:

![](/img/wsl-menu.png)

Next, update CentOS by running:

`yum check-update`

`yum update`

### Prepare CentOS for Genesis

1. Install package group:

`yum groupinstall base`

2. Install Java 11 or scp jdk from local binaries folder and install:

```none title="CentOS"
sudo yum install java-11-openjdk-devel
```

Once you have set this up, it is a good idea to export the distribution:

```none title="PowerShell"
wsl --export CentOS7 centos.backup
```

You can then [import](https://docs.microsoft.com/en-us/windows/wsl/use-custom-distro#import-the-tar-file-into-wsl) it again under a different name. This allows you to have multiple distributions for different projects, for example, or for running Intellij.

### Copying files between Windows and WSL

From WSL, your Windows drives are available from `/mnt/${driveLetter}`:

```none title="CentOS"
# pwd
/mnt
# ll
total 0
drwxrwxrwx 1 root root  512 Aug  8 12:48 c
drwxrwxrwx 1 root root 4096 Aug 14 08:50 d
drwxrwxrwt 5 root root  100 Aug 14 10:16 wsl
#
```

From Windows 10, your WSL distros are accessible from ** \\\wsl$\ ** in Windows Explorer.

### Windows Firewall set-up

If you are using Windows Firewall, you need to allow smooth network communication between your WSL distros and Windows.

First, get the network range for your WSL network switch; run `ipconfig.exe` as admin in PowerShell and look for WSL:

```
Ethernet adapter vEthernet (WSL):

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::6928:38ea:1eb7:84bc%43
   IPv4 Address. . . . . . . . . . . : 172.28.224.1
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . :
```

Run the following command as admin so your firewall will not block inbound traffic from your WSL instances:

```none title="PowerShell"
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound  -InterfaceAlias "vEthernet (WSL)"  -Action Allow
```

## Setting up a Database

### Installing FDB (recommended for development environments)

As root (note, replace `alpha` with the application user set up):

```none title="CentOS"
useradd alpha
usermod -aG wheel alpha
```

Then...

```none title="CentOS"
rpm -Uvhi https://github.com/apple/foundationdb/releases/download/6.3.23/foundationdb-clients-6.3.23-1.el7.x86_64.rpm
rpm -Uvhi https://github.com/apple/foundationdb/releases/download/6.3.23/foundationdb-server-6.3.23-1.el7.x86_64.rpm
mv /usr/bin/systemctl /usr/bin/systemctl.old
curl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/master/files/docker/systemctl.py > /usr/bin/systemctl
chmod +x /usr/bin/systemctl
fdbcli --exec "configure new single memory ; status"
systemctl enable foundationdb
systemctl start foundationdb
```

Then to check if it's running: 

`systemctl status foundationdb`



### Running Aerospike from Docker

You can run Aerospike with the following Docker command:

```none title="CentOS"
docker run --name aerospike -tid -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike/aerospike-server:3.15.1.4
```

This creates a download and runs Aerospike in a Docker container.

To check if the container is running, use the `docker container ls -a` command. This will show the id and name of the Aerospike
container. You need these to interact with the container.

```none title="CentOS"
# docker container ls -a
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS                      PORTS               NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   2 minutes ago       Exited (0) 32 seconds ago                       priceless_bardeen
```

To start or stop the container, use `docker start|stop ${containerName}`:

```none title="CentOS"
# docker stop priceless_bardeen
priceless_bardeen
# docker container ls -a
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
        PORTS               NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   5 minutes ago       Exited (0) 3 minutes ago                       priceless_bardeen
# docker start priceless_bardeen
priceless_bardeen
# docker container ls -a
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
 PORTS                              NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   5 minutes ago       Up 4 seconds        0.0.0.0:3000-3003->3000-3003/tcp   priceless_bardeen
```

To remove the container, use `docker rm ${containerName}`:

```none title="CentOS"
# docker rm priceless_bardeen
priceless_bardeen
# docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS
NAMES
```

After removing, you can create a fresh container using the same command as above:

```none title="CentOS"
# docker run -tid -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike/aerospike-server:3.15.1.4
41e9aee4246ca1aaaa5d5fb4e832e0778ba541cf56ad37869c675bc96c1ceb3e
# docker container ls -a
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
 PORTS                              NAMES
41e9aee4246c        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   6 seconds ago       Up 5 seconds        0.0.0.0:3000-3003->3000-3003/tcp   sweet_sinoussi
```

By default, the Aerospike Docker database only has the **test** namespace, so you need to change the namespace in the
file **genesis-system-definition.kts**:

```kotlin
    ...
    systems {
        system(name = "DEV") {
            ...
            item(name = "DbNamespace", value = "test")
            ...
        }
    }
    ...
```

### Running Postgres from Docker

Running Postgres from Docker is very similar to running Aerospike:

```none title="CentOS"
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c shared_buffers=80MB -c max_connections=250
```

This downloads and runs a Postgres image for version 12.6. Other versions are available; for more
details [see here](https://hub.docker.com/_/postgres/). For version 10, change `12.6-alpine` to `10.16-alpine`.


To connect, use this JDBC URL:

```none title="CentOS"
jdbc:postgresql://localhost:5432/?user=postgres&password=docker
```

### Running MSSQL from Docker
Run the following Docker command:

```none title="CentOS"
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=docker" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
```

This downloads and runs an MSSQL image for version 2019-latest. Other versions are available; for more
details [see here](https://hub.docker.com/_/microsoft-mssql-server).

To connect, use this JDBC URL:

```none title="CentOS"
jdbc:sqlserver://localhost:1433;database=master;user=sa;password=docker
```

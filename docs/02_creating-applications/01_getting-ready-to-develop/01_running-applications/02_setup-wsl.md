---
id: wsl-setup
sidebar_label: Setting up WSL
sidebar_position: 2
title: Setting up WSL
---

## The Windows Subsystem for Linux
Many corporate workstations are Windows based, due to the centralised governance and security that the enterprise editions offer.

The Windows Subsystem for Linux enables developers to run a GNU/Linux environment -- including most command-line tools, utilities, and applications -- directly on Windows, unmodified, without the overhead of a traditional virtual machine or dualboot setup.

The Genesis LCNC platform provides several ease-of-development tools that are designed to work seamlessly on Linux or WSL. If your development environment is Windows, we recommend installing WSL.

## Install Windows Terminal
If you haven’t already - please install Windows terminal. This provides a tabbed single Window from which you can open different command line tools, [link here](https://www.microsoft.com/store/productId/9N0DX20HK701).

## Install WSL2
Your Windows install must be 2004+ (2020 May feature release or higher) and you will need to install the Windows Subsystem for Linux. For details see this [link](https://docs.microsoft.com/en-us/windows/wsl/install-win10). 

If you have previously enabled WSL, you need to set the default version to 2 and (optionally) convert existing distros:

```
PS C:\Users\user.name> wsl -l -v
  NAME      STATE           VERSION
* Ubuntu    Stopped         1
PS C:\Users\user.name> wsl --set-default-version 2
For information on key differences with WSL 2 please visit https://aka.ms/wsl2
PS C:\Users\user.name> wsl --set-version Ubuntu 2
Conversion in progress, this may take a few minutes...
For information on key differences with WSL 2 please visit https://aka.ms/wsl2
Conversion complete.
PS C:\Users\user.name> wsl -l -v
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

## Install CentOS for WSL2
WSL distrubtions can be found easily at various locations on the web. For expedience, you can use this article from Microsoft in order to build a CentOS distro from a Docker image:

[https://docs.microsoft.com/en-us/windows/wsl/use-custom-distro#export-the-tar-from-a-container](https://docs.microsoft.com/en-us/windows/wsl/use-custom-distro#export-the-tar-from-a-container)

(Note that this approach requires Docker to be installed. So, if necessary, jump ahead to the Docker installation section).

At this point, CentOS should be available from Windows Terminal. Note the new entry in the drop-down menu:

![](/img/wsl-menu.png)

Next, update CentOS by running:

`yum check-update`

`yum update`

## Prepare CentOS for Genesis
1. Install package group: 

`yum groupinstall base`

2. Install Java 11 or scp jdk from local binaries folder and install:
    
```
sudo yum update
sudo yum install java-11-openjdk-devel
sudo alternatives --config java    # select the option that corresponds to JDK 11
sudo alternatives --config javac   # select the option that corresponds to JDK 11
```
    
3. Create a soft link to your Maven **settings.xml** file:
    
```
[root@machine user.name]# cd ~
[root@machine ~]# ll
total 16
-rw------- 1 root root 6921 Aug  8  2019 anaconda-ks.cfg
-rw------- 1 root root 6577 Aug  8  2019 original-ks.cfg
[root@machine ~]# mkdir .m2
[root@machine ~]# cd .m2/
[root@machine .m2]# ll
total 0
[root@machine .m2]# ln -s /mnt/c/Users/user.name/.m2/settings.xml
[root@machine .m2]# ll
total 0
lrwxrwxrwx 1 root root 43 Aug 14 09:28 settings.xml -> /mnt/c/Users/user.name/.m2/settings.xml
``` 

Once you have set this up, it is a good idea to export the distribution. You can then import it again under a different name. This allows you to have multiple distributions for different projects, for example, or for running Intellij:

```
wsl --export CentOS7 centos.backup
```

## Install Docker Desktop for Windows
For your database, you could run Aerospike or Postgres in Docker, using Docker for Windows integration with WSL2. For instructions, [check here](https://docs.docker.com/docker-for-windows/). For a download, [click here](https://hub.docker.com/editions/community/docker-ce-desktop-windows/).

Ensure that you have the WSL2 integration enabled and that you have enabled integration with your CentOS distribution:

This allows you to access the docker command; as well as any docker container from any of the integrated distros, as well as from Windows.

This setting can be accessed by opening Docker Desktop, then navigating to **Settings** > **Resources** > **WSL Integration**.

## Running Aerospike from Docker
You can run Aerospike with the following Docker command:

```
docker run --name aerospike -tid -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike/aerospike-server:3.15.1.4
```

This creates a download and runs Aerospike in a Docker container.

To check if the container is running, use the Docker `ps -all` command. It will show the id and name of the Aerospike container. You will need these to interact with the container.

```
[root@machine wsl]# docker ps -all
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS                      PORTS               NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   2 minutes ago       Exited (0) 32 seconds ago                       priceless_bardeen
```

To start or stop the container, use `docker start|stop _container name_:

```
[root@machine wsl]# docker stop priceless_bardeen
priceless_bardeen
[root@machine wsl]# docker ps -all
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
        PORTS               NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   5 minutes ago       Exited (0) 3 minutes ago                       priceless_bardeen
[root@machine wsl]# docker start priceless_bardeen
priceless_bardeen
[root@machine wsl]# docker ps -all
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
 PORTS                              NAMES
c3468768d9c9        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   5 minutes ago       Up 4 seconds        0.0.0.0:3000-3003->3000-3003/tcp   priceless_bardeen
```

To remove the container, use `docker rm container name`:

```
[root@machine wsl]# docker rm priceless_bardeen
priceless_bardeen
[root@machine wsl]# docker ps -all
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS
NAMES
```

After removing, you can create a fresh container using the same command as above:

```
[root@machine wsl]# docker run -tid -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike/aerospike-server:3.15.1.4
41e9aee4246ca1aaaa5d5fb4e832e0778ba541cf56ad37869c675bc96c1ceb3e
[root@machine wsl]# docker ps -all
CONTAINER ID        IMAGE                                 COMMAND                CREATED             STATUS
 PORTS                              NAMES
41e9aee4246c        aerospike/aerospike-server:3.15.1.4   "/entrypoint.sh asd"   6 seconds ago       Up 5 seconds        0.0.0.0:3000-3003->3000-3003/tcp   sweet_sinoussi
```

By default, the Aerospike Docker database only has the **test** namespace, so you need to change the namespace in the file **genesis-system-definition.kts**.

## Running Postgres from Docker
Running Postgres from Docker is very similar to running Aerospike:

```
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c shared_buffers=80MB -c max_connections=250
```

This downloads and runs a Postgres image for version 12.6. Other versions are available; for more details [see here](https://hub.docker.com/_/postgres/). For version 10, change `12.6-alpine` to `10.16-alpine`.

To connect, use this JDBC URL:

```
jdbc:postgresql://localhost:5432/?user=postgres&password=docker
```

## Running MSSQL from Docker

```
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=docker" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
```

This downloads and runs a MSSQL image for version 2019-latest. Other versions are available; for more details [see here](https://hub.docker.com/_/microsoft-mssql-server).

To connect, use this JDBC URL:

```
jdbc:sqlserver://localhost:1433;database=master;user=sa;password=docker
```

## Copying files between Windows and WSL
From WSL, your Windows drives are available from `/mnt/_drive letter_`:

```
[root@LONPC24 mnt]# pwd
/mnt
[root@LONPC24 mnt]# ll
total 0
drwxrwxrwx 1 root root  512 Aug  8 12:48 c
drwxrwxrwx 1 root root 4096 Aug 14 08:50 d
drwxrwxrwt 5 root root  100 Aug 14 10:16 wsl
[root@LONPC24 mnt]#
```

From Windows, your WSL distros are accessible from **\\wsl$\** in windows explorer.

## Windows Firewall set-up
If you are using Windows Firewall, you need to allow smooth network communication between your WSL distros and Windows. First, get the network range for your WSL network switch; run `ipconfig.exe` from powershell and look for WSL:

```
Ethernet adapter vEthernet (WSL):

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::6928:38ea:1eb7:84bc%43
   IPv4 Address. . . . . . . . . . . : 172.28.224.1
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . :
```

Run this powershell command in Windows so your firewall will not block inbound traffic from your WSL instances:

```
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound  -InterfaceAlias "vEthernet (WSL)"  -Action Allow
```
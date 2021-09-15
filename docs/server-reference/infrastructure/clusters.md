---
id: clusters
title: Clusters
sidebar_label: Clusters
sidebar_position: 1

---
The genesis platform is highly resilient and easy to cluster for a High Availability (HA) setup. This area takes you through the steps required to establish a HOT-HOT setup.

## Pre-requisites

This setup will only focus on the genesis platform part of a HA setup. The database is expected to be decoupled from the Genesis server instances in its HA setup.

Equally, a HA load balancer is expected to serve the web traffic to the primary node and fail over to the secondary node when the primary node is unresponsive.

The cluster servers need to be able to connect to each other on the configured cluster port (6000 is the default conf) and by host name.

### Example setup in AWS

![](/img/cluster-1.png)

## Configure the system definitions

Add all the nodes in the cluster to the hosts section for the specific environment . You must do this on all nodes by editing **genesis-system-definition.kts**.

    systems {
    
        system(name = "DEV") {
    
            hosts {
                host(name = "NodeA")
                host(name = "NodeB")
            }
    
            item(name = "DbNamespace", value = "genesis")
            item(name = "ClusterPort", value = "6000")
            item(name = "location", value = "LO")
            item(name = "LogFramework", value = "LOG4J2")
            item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        }
    
    }

To activate any configuration change to the genesis platform and/or application, you have to run the command **genesisInstall** on every changed node.

Starting both nodes should present both nodes on a STANDBY mode.

Running the **mon** command should show the following:

![](/img/cluster-2-mon.png)

Running the **MonCluster** command shows both nodes:

![](/img/cluster-3-moncluster.png)

## Set the primary node

Use the **SetPrimary** command to set one of the nodes to Primary state

This should be the output of **MonCluster** if **SetPrimary** was executed on NodeA:

## Disaster recovery: example

In a clustered Genesis setup, all session data is shared amongst all nodes. Following the example setup in the Prerequisites section, if the Primary Node fails and goes offline, The load balancer should divert traffic to the Secondary node, which contains all the session data for the end users. Their work will continue without disruption.

If you decide that the Primary will not to come back online within an acceptable timeframe, you then set the Secondary node to Primary.

Running **SetPrimary** on NodeB makes it the Primary node. 

## Vertical and horizontal scaling

If you are adding nodes for horizontal scaling simply add the details of the extra nodes to the hosts section in **genesis-system-definition.kts**.

    hosts {
    host(name = "NodeA")
          host(name = "NodeB")
    	host(name = "NodeC")
          …
    }

Every Genesis process is an independent Java process running on a dedicated JVM. Each process can be configured with JVM-specific memory management configurations (-Xmx -Xms etc.) in the _module_**-processes.xml** file.

Example:

    <process name="GENESIS_WEBMON">
    	<start>true</start>
    	<groupId>GENESIS</groupId>
    	<options>-Xmx512m -DXSD_VALIDATE=false</options>
    	<module>webmon</module>
    	<package>global.genesis.webmon</package>
    	<config>genesis-webmon-config.xml</config>
    	<description>Admin and operations web interface</description>
    </process>

## Environment variables

The Genesis LCNC Platform supports extraction of system-level variables to populate solution-specific settings. The system-level variables can be derived from enterprise configuration management system and the platform supports encrypted settings.

    item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
    item(name = "DbPassword", value = System.getenv("DBPASSWORD"), encrypted = true)
    item(name = "GenesisKey", value = System.getenv("GENESIS_KEY"))

## External runtime dependencies

The platform operates without any external dependencies and is well suited to network environments with no public ingress or egress traffic.
The genesis platform supports extraction of system level variables to populate solution specific settings. The system level variables can be derived from enterprise configuration management system and the platform supports encrypted settings.

## Encryption of data in transit and REST

Genesis recommends using a local reverse proxy with SSL termination to provide end-to-end encryption from the web application to the application back end. The platform does not provide specific functionality to encrypt data at REST, as this is best achieved by the database solution deployed for the overall installation and/or the disk partition encryption of the Virtual Machine (VM).

## Independent processes

Every Genesis process is an independent Java process running on a dedicated JVM. This  enables segregation of data classification. account privileges & service tiering.

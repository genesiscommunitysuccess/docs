---
title: 'Clusters'
sidebar_label: 'Clusters'
id: clusters
---
The Genesis low-code platform is highly resilient and easy to cluster for a High Availability (HA) setup. This area takes you through the steps required to establish a HOT-HOT setup.

## Prerequisites

This set-up focuses on the Genesis low-code platform within an HA setup. The database is expected to be decoupled from the Genesis server instances in its HA setup.

An HA Load Balancer is required to direct web traffic to the primary node and fail over to the secondary node when the primary node is unresponsive.

The cluster servers need to be able to connect to each other on the configured cluster port (6000 is the default) and by host name.

### Example set-up in AWS

![](/img/cluster-1.png)

## Configure the system definitions

Add all the nodes in the cluster to the hosts section for the specific environment. You must do this on all nodes by editing **genesis-system-definition.kts**.

```kotlin
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
```

To activate any configuration change to the platform and/or application, you have to run the command **genesisInstall** on every changed node.

When you start a node, it will be in STANDBY mode. You can run the **mon** command to confirm this:

![](/img/cluster-2-mon.png)

Running the **MonCluster** command shows all nodes - there are two in this instance:

![](/img/cluster-3-moncluster.png)

## Set the primary node

Some Genesis processes (and, potentially, application processes) can only run on a single node. So it is important to set one of your nodes as the primary node. Go to that node and run the **SetPrimary** command to set it to Primary state.

This should be the output of **MonCluster** if **SetPrimary** was executed on NodeA:

![](/img/cluster-nodea-now-primary.png)

For reference, let's look at a process that has been configured to run on the primary node only. The key definition at the end of the block is the one that sets **primaryOnly** to **true**:

```xml
<process name="GENESIS_AUTH_CONSOLIDATOR">
    <groupId>AUTH</groupId>
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-consolidator2</module>
    <package>global.genesis.consolidator2</package>
    <config>auth-consolidator.xml</config>
    <description>Consolidator for all AUTH related consolidations</description>
    <primaryOnly>true</primaryOnly>
</process>
```

## Disaster recovery: example

In a clustered Genesis setup, all session data is shared amongst all nodes. Following the example setup in the Pre-requisites section, if the Primary node fails and goes offline, The Load Balancer should divert traffic to the Secondary node, which contains all the session data for the end users. Their work will continue without disruption. Below you can see the switch to the secondary node using **MonCluster**.

![](/img/cluster-4-disaster-a.png)

If you decide that the primary node will not come back online within an acceptable time frame, you can then set the Secondary node to Primary.

To do this, run **SetPrimary** on NodeB. This means that any of those processes where **primaryOnly** is defined as **true** will now start running on NodeB.

You can then see the change on **MonCluster**. But note here that the processes are back up on NodeA.

![](/img/cluster-5-disaster-c.png)

So, when you are satisfied that NodeA is performing reliably, you can run **SetPrimary** on NodeA again to make it the primary node. NodeB is automatically reset to Secondary.

![](/img/cluster-6-disasterd.png)

In summary, the Load Balancer has handled the automatic switching to the secondary node in response to failure. You have then been changed the two nodes manually using **SetPrimary**.

## Capacity planning
You can see CPU and memory usage across an application using the **mon** command. This gives you a guide to future scaling, either horizontally (extra nodes) or vertically (essentially, you can double the CPU to 8 core and the RAM to 32GB). You can install a larger disc to suit requirements.

You can customise our [metrics](/operations/metrics/metrics/) to output information such as the number of transactions per Event Handler, for example. You can then choose how to store and report on the data points.

Additionally, the Genesis low-code platform is compatible with all major monitoring and planning tools for the Linux environment, such as [Nagios](https://nagios.com), [ITRS Geneos](https://www.itrsgroup.com/products/capacity-planner) or [Prometheus](https://prometheus.io/blog/2019/10/10/remote-read-meets-streaming/#summary).


## Vertical and horizontal scaling

If you are adding nodes for horizontal scaling, simply add the details of the extra nodes to the `hosts` section in **genesis-system-definition.kts**.

```kotlin
hosts {
    host(name = "NodeA")
    host(name = "NodeB")
    host(name = "NodeC")
        …
}
```

Every Genesis process is an independent Java process running on a dedicated JVM. Each process can be configured with JVM-specific memory management configurations (-Xmx -Xms etc.) in the _module_**-processes.xml** file.

Example:

```xml
<process name="GENESIS_WEBMON">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>webmon</module>
    <package>global.genesis.webmon</package>
    <config>genesis-webmon-config.xml</config>
    <description>Admin and operations web interface</description>
</process>
```

## Environment variables

The Genesis platform supports extraction of system-level variables to populate solution-specific settings. The system-level variables can be derived from enterprise configuration management system and the platform supports encrypted settings.

```kotlin
item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
item(name = "DbPassword", value = System.getenv("DBPASSWORD"), encrypted = true)
item(name = "GenesisKey", value = System.getenv("GENESIS_KEY"))
```

## External runtime dependencies

The platform operates without any external dependencies and is well suited to network environments with no public ingress or egress traffic. The platform supports extraction of system-level variables to populate solution-specific settings. The system-level variables can be derived from the enterprise configuration management system and the platform supports encrypted settings.

## Encryption of data in transit and REST

Genesis recommends using a local reverse proxy with SSL termination to provide end-to-end encryption from the web application to the application back end. The platform does not provide specific functionality to encrypt data at REST, as this is best achieved by the database solution deployed for the overall installation and/or the disk partition encryption of the Virtual Machine (VM).

## Independent processes

Every Genesis process is an independent Java process running on a dedicated JVM. This ensures segregation of data classification. account privileges and service tiering.

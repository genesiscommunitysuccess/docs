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

Running the **MonCluster** command shows this:

![](/img/cluster-3-moncluster.png)

## Set the primary node

Use the **SetPrimary** command to set one of the nodes to Primary state

This should be the output of **MonCluster** if **SetPrimary** was executed on NodeA:

## Disaster recovery: example

## Vertical and horizontal scaling
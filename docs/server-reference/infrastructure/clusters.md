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

Example setup in AWS
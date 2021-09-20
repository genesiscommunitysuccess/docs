---
sidebar_position: 3
title: Cache
sidebar_label: Cache
id: cache

---
Database caching on local microserviceis supported out of the box. You can configure a caching layer for any Genesis module. The cache can reduce the database workload for tables that contain static data.

## Configuration

The caching mechanism applies to single-record database look-up operations across the whole microservice runtime.

The cache definition can be defined in two different forms:

* in xml format,  inside the process config file itself.  (as used in xml-based configurations, such as consolidator.)
* in a GPAL format. The GPAL format is generally used for microservices using a GPAL script (defined in the <script> attribute in processes.xml) and this file will be defined in the <config> attribute of the process definition. 

The available options for both XML and GPAL are:


---
title: 'Genesis containerisation - health checks'
sidebar_label: 'Health checks'
id: healthchecks
keywords: [operations, containerisation, container, docker, configuration, healthchecks]
tags:
    - operations
    - containerisation
    - container
    - docker
    - healthchecks
---

The Genesis low-code platform Docker image provides a health check endpoint, which reports the status of the container.

This endpoint can be used for your liveliness/readiness checks if you are using container orchestration, or you can use it in your own checks if you are managing your containers yourself.

| Path | Port | Response |
| --- | --- | --- |
| /health/status | This is set in the [System Definition](../../../server/integration/data-pipeline/advanced/#system-definition-properties) with the item `DaemonHealthPort` and an integer value for the port chosen to serve the health status<br/><br/>Example: `item(name = "DaemonHealthPort", value = "4569")`| Either `200` for HEALTHY or `503` for UNHEALTHY if ANY of the underlying services are not in a healthy state.<br/><br/>The payload of the response is in JSON format and provides details for each underlying service configured in the container, including their individual health status |
Note: You need to ensure the port is accessible with the Docker `--port` option; alternatively, check the documentation for whichever container orchestration system you use.

## Sample response 
```
[
    {
        "PROCESS_NAME":"GENESIS_AUTH_MANAGER",
        "STATUS":"UP",
        "MESSAGE":"",
        "PORT":8001
    },
    {
        "PROCESS_NAME":"GENESIS_AUTH_DATASERVER",
        "STATUS":"UP",
        "MESSAGE":";Lmdb currently uses 1% of available space (total size 2GB)",
        "PORT":8002
    },
    {
        "PROCESS_NAME":"GENESIS_AUTH_PERMS",
        "STATUS":"UP",
        "MESSAGE":"",
        "PORT":8003
    },
    {
        "PROCESS_NAME":"GENESIS_AUTH_REQUEST_SERVER",
        "STATUS":"UP",
        "MESSAGE":"",
        "PORT":8004
    },
    {
        "PROCESS_NAME":"GENESIS_AUTH_CONSOLIDATOR",
        "STATUS":"UP",
        "MESSAGE":"",
        "PORT":8005
    },
    {
        "PROCESS_NAME":"GENESIS_CLUSTER",
        "STATUS":"UP",
        "MESSAGE":";Lmdb currently uses 1% of available space (total size 2GB)",
        "PORT":9000
    },
    {
        "PROCESS_NAME":"GENESIS_ROUTER",
        "STATUS":"UP",
        "MESSAGE":"",
        "PORT":9017
    },
    {
        "PROCESS_NAME":"GENESIS_NOTIFY",
        "STATUS":"UP",
        "MESSAGE":";Lmdb currently uses 1% of available space (total size 2GB)",
        "PORT":9018
    }
]
```

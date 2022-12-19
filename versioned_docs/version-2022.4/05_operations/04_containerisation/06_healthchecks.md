---
title: 'Genesis Containerisation - health checks'
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
| /health/status | This is set in the [System Definition](../../../server/integration/data-pipeline/advanced/#system-definition-properties) with the item `DaemonHealthPort` | Either `200` for HEALTHY or `503` for UNHEALTHY<br/><br/>(Note: the endpoint doesn't return a response body)|

Note: You will need to ensure the port is accessible with either the Docker `--port` option, or check the documentation for whichever container orchestration system you use.

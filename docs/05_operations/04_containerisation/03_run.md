---
title: 'Genesis containerisation - running a container'
sidebar_label: 'Run a container'
id: run
keywords: [operations, containerisation, container, docker, run]
tags:
    - operations
    - containerisation
    - container
    - docker
    - run
---

If you haven’t already initialised the database, you can run the Docker container passing the environment variable `GENESIS_DB_INSTALL=true`;this will trigger a `remap` to create all the tables and will exit on completion.

```bash
docker run -e GENESIS_DB_INSTALL=true genesis/appname:1.0.0-SNAPSHOT
```

You can then start the Docker container with whichever system you choose to use (e.g. docker-compose / Kubernetes etc.) Or simply run the container on its alone:

```bash
docker run -it -p 443:443 genesis/appname:1.0.0-SNAPSHOT
```

Note: The `-p` flag is used in this example, as nginx is bundled in with our image and presents the Genesis app on port 443.


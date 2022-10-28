---
title: 'Genesis Containerisation - running a container'
sidebar_label: 'Run a Container'
id: run
keywords: [containerisation, container, docker]
tags:
    - containerisation
---

If you haven’t already initialised the database, you can run the docker container passing the environment variable `GENESIS_DB_INSTALL=true` which will trigger a `remap` to create all the tables and will exit on completion.

```bash
docker run -e GENESIS_DB_INSTALL=true genesis/appname:1.0.0-SNAPSHOT
```

You can then start the docker container with whichever system you choose to use (e.g. docker-compose / Kubernetes etc.) Or simply run the container stand alone:

```bash
docker run -it -p 443:443 genesis/appname:1.0.0-SNAPSHOT
```

Note: The `-p` flag is used in this example as nginx in bundled in with our image and presents the Genesis app on port 443.

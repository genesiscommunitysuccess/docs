---
title: 'Run the application (Docker)'
sidebar_label: 'Run the application (Docker)'
id: run-the-application-docker
---

The instructions on this page are for using Docker. If you prefer to use WSL/CentOS as your environment, there are [separate instructions](/getting-started/go-to-the-next-level/run-the-application-wsl/).

## Building and composing Docker images 

To build and start the Docker images execute the following command from the root of the project:
```shell title="./positions-app-tutorial"
docker-compose up -d
```

:::tip
Make sure that the `docker` daemon is running.
:::

## Accessing the application

After the Docker containers are up and running, the application is accessible on: [http://localhost:6060](http://localhost:6060)

Wait until all the processes are running on the server container (it takes a couple of minutes), you can log in.

![](/img/positions_login.png)

## Conclusion
That’s it. You have built and started the application.


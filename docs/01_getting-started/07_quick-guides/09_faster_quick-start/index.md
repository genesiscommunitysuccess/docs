---
title: 'Quick Start'
sidebar_label: 'Quick start with Docker'
sidebar_position: 1
id: introduction
---

## Requirements

You need just three things before you can start this exercise:

- You must set up your .npmrc, which is explained [here](/getting-started/prerequisites/hardware-and-software).

- You must have a gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```

- You must have (unsurprsingly) Docker for Desktop. For instructions on how to install this, see the [Docker documentation](https://docs.docker.com/docker-for-windows/). For a
download, [click here](https://hub.docker.com/editions/community/docker-ce-desktop-windows/).

## What you will build

The very simple application you will build will look like this:

- a simple table with 5 fields
- two front-end components: one to display data and one to insert data

That’s it. Just enough to get you up and running. Obviously, there is much more you could do, but that can wait for another day.

With a lack of imagination we hope you will find trustworthy, we are going to call this example application **alpha**. You will see this reflected in the file names throughout.

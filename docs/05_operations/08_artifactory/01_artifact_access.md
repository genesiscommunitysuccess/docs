---
title: 'Artifact access'
sidebar_label: 'Artifact access'
sidebar_position: 1
id: artifact-access
keywords: [operations, artifacts, artifactory]
tags:
    - operations
    - artifacts
    - artifactory
---

This document covers the Genesis artifact store, which is an instance of JFrog's Artifactory.


## Obtaining credentials

Genesis provides clients with a username and password for access.  Our Customer Success team can arrange this.
Log in with those credentials here:  [Genesis Artifactory](https://genesisglobal.jfrog.io/ui/login/)

Normally, these credentials will give access to four categories of artifact:
 * Server-side code and scripts (Java/Kotlin)
 * Web artifacts (npms)
 * Community objects (mixed)
 * Any artifacts specific to a single client (a private repo)


## Server-side code

There is one principal repository for server-side artifacts, which includes:
 * Genesis low-code platform frameworks (supplied as zip files)
 * Gradle plugins to aid development

This repository is called 'libs-release-client' and is available
[here](https://genesisglobal.jfrog.io/artifactory/libs-release-client/).

Default project creation using the CLI tool [genx](/getting-started/quick-start/create-a-new-project) will populate
URLs as gradle dependencies.


## Web artifacts

Web server artifacts from Genesis are packaged as [NPMs](https://docs.npmjs.com/about-npm) and 
[scoped](https://docs.npmjs.com/about-scopes) as @genesislcap/{package}. The Genesis Artifactory is the primary
source of that scope.

We offer both our scoped packages and a remote to the npmjs.org repository via a single repository, available
[here](https://genesisglobal.jfrog.io/artifactory/npm/).  This is a virtual repository on Artifactory.

We offer direct access to our scoped packages only via a repository called ['github-packages'](https://genesisglobal.jfrog.io/artifactory/github-packages/). (We build the packages on Github, but we do not expose them there.)

These repositories are used in **.npmrc** files, by developers and CI/CD systems.  Further details about the use
of web repositories are available [here](/getting-started/quick-start/hardware-and-software/#npmrc-set-up).


## Community objects

There are a number of Genesis user community uploads in a Genesis-curated repository available
[here](https://genesisglobal.jfrog.io/artifactory/community-uploads/).


## Private repositories

If you want Genesis to build and host artifacts for you, we will create a repository dedicated to you; The URL will be provided, and you will have read-write access to the repository. T


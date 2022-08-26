---
id: artifact-access
title: 'Artifact Access'
sidebar_label: 'Artifact Access'
sidebar_position: 1

---

This document covers Genesis' artifact store, which is an instance of JFrog's Artifactory.


## Obtaining Credentials

Genesis provides clients with a username and password to access.  Our Customer Success team can arrange this.
Log in with those credentials here:  [Genesis Artifactory](https://genesisglobal.jfrog.io/ui/login/)

Normally, these credentials will give access to four categories of artifact:
 * Server-side code and scripts (Java/Kotlin)
 * Web artifacts (npms)
 * Community objects (mixed)
 * Any artifacts specific to a single client (a private repo)


## Server-side code

There is one principal repository for server-side artifacts, which include:
 * Genesis low-code platform frameworks (supplied as zip files)
 * Gradle plugins to aid development

This repository is called 'libs-release-client' and is available
[here](https://genesisglobal.jfrog.io/artifactory/libs-release-client/).

Default project creation using the cli tool [genx](/getting-started/quick-start/create-a-new-project) will populate
urls as gradle dependencies.


## Web artifacts

Web server artifacts from Genesis are packaged as [NPMs](https://docs.npmjs.com/about-npm) and 
[scoped](https://docs.npmjs.com/about-scopes) as @genesislcap/{package}.  The Genesis Artifactory is the primary
source of that scope.

We offer both our scoped packages and a remote to the npmjs.org repository via a single repository, available
[here](https://genesisglobal.jfrog.io/artifactory/npm/).  This is a virtual repository on Artifactory.

We offer direct access to only our scoped packages via a repository called 'github-packages' (we build them on Github
but do not expose  them  there) and is available [here](https://genesisglobal.jfrog.io/artifactory/github-packages/).

These repositories are used in **.npmrc** files, by developers and CI/CD systems.  More details on the use
of web repositories is [here](/getting-started/prerequisites/hardware-and-software/#npmrc-set-up).



## Community objects

There is a number of Genesis user community uploads in a Genesis-curated repository available
[here](https://genesisglobal.jfrog.io/artifactory/community-uploads/).


## Private repositories

If there are any artifacts that Genesis should build and host, we will create a repository dedicated to that and your
user will give you read-write access to that repository.  The URL for it will be provided.


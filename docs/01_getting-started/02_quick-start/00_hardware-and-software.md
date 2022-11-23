---
title: 'Quick Start - Hardware and software'
sidebar_label: 'Hardware and software'
id: hardware-and-software
sidebar_position: 2
keywords: [getting started, quick start, software, hardware, repository, npmrc, gradle, foundation ui]
tags:
    - getting started
    - quick start
    - software
    - hardware
    - repository
    - npmrc
    - gradle
    - foundation ui
---

This page gives you the hardware and software requirements needed in order to run a development workstation for the Genesis low-code platform. It also provides instructions for accessing the Genesis repository and configuring the Genesis packages.


## Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

## Recommended software packages

| Package	| Minimum Version | 
|--------------|:---------------:|
| [IntelliJ](https://www.jetbrains.com/idea/download/?fromIDE=#section=windows)	| 2021.2.3 and above  |
|[Visual Studio Code](https://code.visualstudio.com/Download)	|     1.52.1      |
|[Java SDK or JDK](https://www.oracle.com/java/technologies/downloads/) (Choose the **x64 installer** download.)|       11        |
| [NodeJS](https://nodejs.org/download/release/latest-gallium/)  |     16 LTS     |
| [Postman](https://www.postman.com/downloads/) (optional)	|        8        |


You can use a range of IDEs (for example, Eclipse) with the Genesis platform, but only IntelliJIDEA enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJIDEA.

## Requirements

* NodeJS (16 LTS) - https://nodejs.dev/en/
* npm 8 (installed with NodeJS)

## Access to the Genesis repository

For access to Genesis packages, you need a valid [jfrog artifactory](https://jfrog.com/artifactory/) username and password. 

### .npmrc set-up

First, you need configure the `@genesislcap` scope of `npm` to use our jfrog registry.


1. Create an empty `.npmrc` file in your user home directory.
 2. Using your jfrog credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
 3. Click on the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This displays a set of packages; click on **npm**.
 5. In the next screen, enter your password and click on **Insert**. (This is the same password you used to log in to the Genesis repository on jfrog.)  The password entry field is not immediately obvious, so we have highlighted it near the top of the picture below.

 ![](/img/set-me-up.png)

 6. At the bottom of the window is a code snippet of 5 lines (highlighted in the picture above. This includes an encrypted version of your password (which we have blocked in thie picture). Copy this and paste it into the empty **.npmrc** file you created earlier. 

7. In the file, replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

8. Save the file and open a terminal under the directory path `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If the set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@5.0.1 | UNLICENSED | deps: 13 | versions: 306
Genesis Foundation UI
https://github.com/genesislcap/foundation-ui#readme
```

Please [contact us](mailto:support@genesis.global?subject=.npmrc%20Setup) if you run into any problems.

## gradle.properties file
Finally, you should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear (unencrypted) text, for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<beONneON74>
```


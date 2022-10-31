---
title: 'Quick Start - Hardware and software'
sidebar_label: 'Hardware and software'
id: hardware-and-software
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
|[Java SDK](https://www.oracle.com/java/technologies/downloads/)|       11        |
| [NodeJS](https://nodejs.org/en/download/)  |     16 LTS+     |
| [Postman](https://www.postman.com/downloads/) (optional)	|        8        |


You can use a range of IDEs (for example, Eclipse) with the Genesis platform, but only IntelliJIDEA enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJIDEA.

## Requirements

* NodeJS (16 LTS+) - https://nodejs.org/en/
* npm 8 (installed with NodeJS)

## Access to the Genesis repository

For access to Genesis packages, you need a valid [jfrog artifactory](https://jfrog.com/artifactory/) username and password. 

Now you can configure the `@genesislcap` scope of `npm` to use our jfrog registry.


### .npmrc set-up

1. Create an `.npmrc` file in your user home directory.
 2. Using your jfrog credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
 3. Click on the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns. 
 5. Select `npm` for both **Package Type** and **Repository**.
 6. Next, type your password for jfrog in the `Type password to insert your credentials to the code snippets` field. (This is the same password you used to log in to the Genesis repository on jfrog.) Then press **Enter**. 

 ![](/img/set-me-up.png)

 7. Scroll down _inside_ the Set Me Up dialog. At the bottom of the page, you will find a code sample for .npmrc, which contains your scope information, including user name an encrypted password. Copy this and paste it into the file you created in the previous step. For reference, the snippet should look something like this (**Do not** copy the below example directly - because it contains dummy information!):

```shell
@<SCOPE>:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:_password=AAAbbbCCCdddEEEfffGGGhhhIIIjjj111222333444555666777=
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:username=john.doe
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:email=john.doe@company.com
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:always-auth=true
```

8. Replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

9. Save the file and open a terminal under the directory path `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```

Please [contact us](mailto:support@genesis.global?subject=.npmrc%20Setup) if you run into any problems.

## gradle.properties file
Finally, you should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear (unencrypted) text, for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<beONneON74>
```


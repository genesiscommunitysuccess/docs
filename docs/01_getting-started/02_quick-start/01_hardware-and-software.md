---
title: 'Hardware and software'
sidebar_label: 'Hardware and software'
id: hardware-and-software
keywords: [software, hardware, repository, npmrc, gradle, foundation ui]
tags: 
    - software
    - hardware
    - repository
    - npmrc
    - gradle
    - foundation ui
---

On this page, you can learn about the hardware and the software requirements to run a development workstation for the Genesis low-code platform. You will also find the instructions to access the Genesis repository and to configure the Genesis packages.


## Recommended hardware and operating systems

* Operating system : Windows 10 Pro
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

## Recommended software packages

| Package	| Minimum Version | 
|--------------|:---------------:|
| IntelliJ	| 2021.2.3 and above  |
|Visual Studio Code	|     1.52.1      |
|Java SDK|       11        |
| NodeJS  |     16 LTS+     |
| Postman (optional)	|        8        |


You can use a range of IDEs (for example, Eclipse) with the Genesis platform, but only IntelliJIDEA enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJIDEA.

## Requirements

* NodeJS (16 LTS+) - https://nodejs.org/en/
* npm 8 (installed with NodeJS)

## Access to Genesis repository


To access the Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use the jfrog registry.
You will be provided with access details during your on-boarding.

### .npmrc set-up

1. Create an `.npmrc` file in your user home directory.
 2. Log in to the [Genesis repository website](http://genesisglobal.jfrog.io) with your credentials.
 3. Click the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns. 
 5. Select `npm` for both **Package Type** and **Repository**.
 6. Next, type your password for jfrog in the `Type password to insert your credentials to the code snippets`. This is the same password you have used to log in to the Genesis repository on jfrog. Then press **Enter**. 

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

Please [contact us](mailto:support@genesis.global?subject=.npmrc%20Setup) in case of any questions or issues.

## gradle.properties file
You must have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear (unencrypted) text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```


---
title: 'Quick start - hardware and software'
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

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page gives you the hardware and software requirements needed in order to run a development workstation for the Genesis low-code platform. It also provides instructions for accessing the Genesis repository and configuring the Genesis packages.


## Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 32GB minimum
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

### jFrog artifactory with SAML 


**Pre-requisite**

Install JDK11

Install node.js (npm 8)

## .npmrc set-up

:::note
For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry.

This requires credentials for accessing Genesis Artifactory. If you have not been provided with the credentials, please contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login). It's not possible to complete the training without this access, because you won't be able to download the Genesis platform components and build your project.

To follow the instructions below, select **External User** if you are a Genesis customer or partner, or **Internal User** if you are a Genesis employee with an internal Genesis account.
:::

<Tabs defaultValue="external" values={[{ label: 'External User', value: 'external', }, { label: 'Internal User', value: 'internal', }]}>
<TabItem value="external">
This setup presumes you will sign in with jfrog user and password parameters. Please follow the steps:

1. Create an empty `.npmrc` file in your user home directory.
2. Using your jfrog credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
3. Click on the `Welcome <username>` on the top right corner.
4. From the menu, select `Set Me Up`. This displays a set of packages; click on **npm**.
5. In the next screen, enter your password and click on **Insert**. (This is the same password you used to log in to the Genesis repository on jfrog.)  The password entry field is not immediately obvious, so we have highlighted it near the top of the picture below.

![](/img/set-me-up.png)

6. Note: if you have two **.npmrc** files use the type NPMRC file (not Text Document file) when completing these steps.

At the bottom of the window is a code snippet of 5 lines (highlighted in the picture above. This includes an encrypted version of your password (that we have blocked in this picture). Copy this and paste it into the empty **.npmrc** file you created earlier. 

7. In the file, replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

8. Save the file and open a terminal under the directory path `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If the set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@5.0.1 | UNLICENSED | deps: 13 | versions: 306
Genesis Foundation UI
https://github.com/genesislcap/foundation-ui#readme
```
<!-- NO EDIT (NEXT 4 LINES) -->
import StrictSSL from '../../_includes/_strict-ssl.md'

<StrictSSL />
</TabItem>
<TabItem value="internal">
This setup presumes you will sign in with jfrog SAML SSO. Please follow the steps:

1. Create an empty `.npmrc` file in your user home directory.
2. Using SAML SSO log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
3. Click on the `Welcome <username>` on the top right corner.
4. From the menu, select `Set Me Up`. This displays a set of packages; click on **npm**.
5. Copy this command and run the following command directly from a command line using PowerShell (or Windows Command Prompt):
    ```shell
    npm config set registry https://genesisglobal.jfrog.io/artifactory/api/npm/npm/
    ```
6. Replace SCOPE with genesislcap:
    ```shell
    npm config set @<genesislcap>:registry https://genesisglobal.jfrog.io/artifactory/api/npm/npm/
    ```
7. Click edit profile → Click Generate identity token button. Copy token
8. Open your terminal again and use this token run the curl command:
    ```shell
    curl -u <first>.<last>@genesis.global:<token> https://genesisglobal.jfrog.io/artifactory/api/npm/auth/
    ```	
9. Create Base64 password from [here](https://www.base64encode.org/), and then copy encoded password and put in .npmrc
10. Your .npmrc file should look like this:
    ```shell
    @genesislcap:registry=https://genesisglobal.jfrog.io/artifactory/api/npm/github-packages/
    //genesisglobal.jfrog.io/artifactory/api/npm/github-packages/:_password="Base 64 encode of Genesis MS office password"
    //genesisglobal.jfrog.io/artifactory/api/npm/github-packages/:_auth="_auth from curl command"
    //genesisglobal.jfrog.io/artifactory/api/npm/github-packages/:always-auth=true
    //genesisglobal.jfrog.io/artifactory/api/npm/github-packages/:email=rimpa.choudhury@genesis.global	
    ```	
11. Open a new terminal under the directory path `.npmrc` file and type: `npm info @genesislcap/foundation-ui`. If the set-up was successful, you should see a response like this:
    ```shell
    @genesislcap/foundation-ui@5.0.1 | UNLICENSED | deps: 13 | versions: 306
    Genesis Foundation UI
    https://github.com/genesislcap/foundation-ui#readme
    ```
12. To log into the genx CLI now you need to use your Genesis email as the username and an API key as the password. You can get your API key from Jfrog [here](https://genesisglobal.jfrog.io/ui/admin/artifactory/user_profile).


</TabItem>
</Tabs>

Please [contact us](mailto:support@genesis.global?subject=.npmrc%20Setup) if you run into any problems.

## gradle.properties file
Finally, you should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear (unencrypted) text, for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<beONneON74>
```

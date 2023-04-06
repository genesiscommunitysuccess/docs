---
title: 'Quick start - hardware and software'
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

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
| [NodeJS](https://nodejs.org/download/release/latest-gallium/)  |     16 LTS     |
| [Postman](https://www.postman.com/downloads/) (optional)	|        8        |


You can use a range of IDEs (for example, Eclipse) with the Genesis platform, but only IntelliJIDEA enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJIDEA.

## Requirements

* NodeJS (16 LTS) - https://nodejs.dev/en/
* npm 8 (installed with NodeJS)

## Access to the Genesis repository

### .npmrc set-up

:::note
For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry.

This requires credentials for accessing Genesis Artifactory. If you have not been provided with the credentials, please contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login). It's not possible to complete the training without this access, because you won't be able to download the Genesis platform components and build your project.

To follow the instructions below, select **External User** if you are a Genesis customer or partner,  or **Internal User** if you are a Genesis employee with an internal Genesis account.
:::

<Tabs defaultValue="external" values={[{ label: 'External User', value: 'external', }, { label: 'Internal User', value: 'internal', }]}>
<TabItem value="external">
This set-up presumes you will sign in with jfrog user and password parameters. Please follow the steps:

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

<!-- NO EDIT (NEXT 4 LINES) -->
import StricSSL from '../../_includes/_strict-ssl.md'

<StrictSSL />

Please [contact us](mailto:support@genesis.global?subject=.npmrc%20Setup) if you run into any problems.

</TabItem>
<TabItem value="internal">
This set-up presumes you will sign in with jfrog SAML SSO. Please follow the steps:

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


## gradle.properties file
Finally, you should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear (unencrypted) text, for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<beONneON74>
```


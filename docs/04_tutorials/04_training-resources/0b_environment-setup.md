---
id: environment-setup
title: Environment setup
sidebar_label: Environment setup
sidebar_position: 2

---
## Setting up your workstation and a local server

### Workstation setup

Please note that you will need temporary administrator privileges on your workstation during the installation and setup of the dependencies listed here.

#### Recommended hardware and operating system

* Operating system : Windows 10 Pro version 2004 or higher with support for [WSL v2](https://docs.microsoft.com/en-us/windows/wsl/install)
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

#### Needed software packages

| Package	| Minimum Version| 
|--------------|:-----:|
| IntelliJ Community	| 2021.1.3|
| Visual Studio Code	| 1.52.1|
| Java SDK| 11|
| Chrome | 88.0|
| Postman	| 8|
| NodeJS  | 16 LTS+|
| npm | 8 |
| Gradle | 6.8 |
| Windows Subsystem for Linux (WSL) | WSL 2 |

You can use a range of IDEs (for example, Eclipse) with the Genesis low-code platform, but only IntelliJ enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

####  Accessing the Genesis repository and configuring the Genesis packages
#### .npmrc set-up

For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry. 

:::note
This requires credentials for accessing Genesis Artifactory. If you have not been provided with the credentials, please contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login). It's not possible to complete the training without this access as it would not be possible to download the Genesis Platform components and build your project.
:::

1. Create an `.npmrc` file in your user home directory (usually at 'C:\Users\YOUR_LOGIN_NAME\').
 2. Using your credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
 3. Click on the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns. 
 5. Select `npm` for both **Package Type** and **Repository**.
 6. Next, type your password for jfrog in the `Type password to insert your credentials to the code snippets` field. (This is the same password you used to log in to the Genesis repository on jfrog.) Then press **Enter**. 

 ![](/img/set-me-up.png)

 7. Scroll down _inside_ the Set Me Up dialog. At the bottom of the page, you will find a code sample for .npmrc, which contains your scope information, including user name an encrypted password. Copy this and paste it into the file you created in the previous step. For reference, the snippet should look something like this (but **don't** copy the one below - because it contains dummy information!):

```shell
@<SCOPE>:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:_password=AAAbbbCCCdddEEEfffGGGhhhIIIjjj111222333444555666777=
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:username=john.doe
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:email=john.doe@company.com
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:always-auth=true
```

8. Replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

9. Save the file and **open a terminal as administrator** under the directory path of this `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```
:::caution trouble running npm?
Please make sure:
- you have the correct versions of the software packages, especially node and npm, as explained in the [workstation setup](/tutorials/training-resources/training-content-day1/#needed-software-packages). If you have an older version of npm (run 'npm -v'), make sure to uninstall it first.
- if you're behind a corporate network, you may need to setup a proxy:
```shell
npm config set proxy http://proxy_host:port
npm config set https-proxy https://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```
:::

10. Install GenX CLI, a Genesis tool that enables you to seed projects.
```shell
npm install -g @genesislcap/foundation-cli
```

11. Check that GenX CLI is working:
```shell
npx genx
```
and you should see this message:
```shell


   ______                     _     _  __
  / _______  ____  ___  _____(_____| |/ /
 / / __/ _ \/ __ \/ _ \/ ___/ / ___|   /
/ /_/ /  __/ / / /  __(__  / (__  /   |
\____/\___/_/ /_/\___/____/_/____/_/|_|


  GenesisX CLI V1.0.0
```
Feel free to abort this program for now - we'll use genx later on.

#### Gradle setup
Make sure you have a gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your password in clear text:
```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```
:::tip
This is the same credential you used in *step 6* above.
:::

### Local server setup

Make sure you have completed the [Workstation setup](#workstation-setup) prior to this.

We are going to setup Windows Subsystem for Linux (WSL 2) to deploy and run the application locally.

You can install everything you need to run WSL by entering this command in an administrator PowerShell or Windows Command Prompt and then restarting your machine.
```
wsl --install
```
If you need help with the WSL installation, please refer to [here](https://docs.microsoft.com/en-us/windows/wsl/install).

Then download the [Genesis WSL training distro](https://netorg209792-my.sharepoint.com/:u:/g/personal/genesis_files_genesis_global/EVH9uU6r5q9PkTyNhBXsDvABbCtRZgUjvpX1fD5MTs2glA?e=paUHyi). This distro contains everything you need to get started, including: 
Linux CentOS 7 base, Java 11 SDK, genesis user, nginx, FoundationDB.

Now create a local folder where you want to run the distro, e.g., "C:\wsl\distros\training-distro\". Unzip the package downloaded there and from that folder run:
```
wsl --import TrainingCentOS . training-wsl.backup
```

Run the distro:
```
wsl -d TrainingCentOS
```

You should see this message:
```bash
Welcome to Genesis WSL training distro!
[root@hostname training-distro]#
```
:::note
From now on, whenever you see things like "from the terminal or command line" or "run this command", it means from the WSL Linux instance command line as user 'genesis' ('su genesis').
:::

You are good to go!


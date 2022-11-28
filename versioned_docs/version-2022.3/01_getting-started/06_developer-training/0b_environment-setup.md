---
title: Developer training - Environment setup
sidebar_label: Environment setup
sidebar_position: 2
id: environment-setup
keywords: [getting started, quick start, developer training, environment, setup]
tags:
    - getting started
    - quick start
    - developer training
    - environment
    - setup
---

---
## Setting up your workstation and a local server

## Workstation set-up

Please follow these instructions very carefully to ensure your environment is ready for productive training. It's not necessary to have admin rights on your workstation to develop with the Genesis low-code platform, but you might have to check with your System Administrator how to install the required third-party software listed here.

### Recommended hardware and operating system

* Operating system : Windows 10 Pro version 2004 or higher with support for [WSL v2](https://docs.microsoft.com/en-us/windows/wsl/install)
* RAM : 32GB minimum, as we are running full applications locally
* CPU : 8 Core
* SSD : 250GB

### Required software packages

| Package	| Minimum Version| 
|--------------|:-----:|
| IntelliJ Community	| 2022.2|
| Visual Studio Code	| 1.52.1|
| Java SDK| 11|
| Kotlin| 1.7.10|
| Chrome | 88.0|
| Postman	| 8|
| NodeJS  | 16 LTS|
| npm | 8 |
| Gradle | 7.5 |
| Windows Subsystem for Linux (WSL) | WSL 2 |
| Docker Desktop | 4.11.1 |

You can use a range of IDEs (for example, Eclipse) with the Genesis low-code platform, but only IntelliJ enables you to make full use of the Genesis Platform Abstraction Language (**GPAL**) prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

##  Accessing the Genesis repository and configuring the Genesis packages
### .npmrc set-up

For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry.

:::note
This requires credentials for accessing Genesis Artifactory. If you have not been provided with the credentials, please contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login). It's not possible to complete the training without this access, because you won't be able to download the Genesis platform components and build your project.
:::

1. Create an `.npmrc` file in your user home directory (usually at 'C:\Users\YOUR_LOGIN_NAME\').
2. Using your credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
3. Click on the `Welcome <username>` in the top right corner.
4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns.
5. Select `npm` for both **Package Type** and **Repository**.
6. Next, type your password for jfrog in the `Type password to insert your credentials to the code snippets` field. (This is the same password you used to log in to the Genesis repository on jfrog.) Then press **Enter**.

![](/img/set-me-up.png)

7. Scroll down _inside_ the Set Me Up dialog. At the bottom of the page, you will find a code sample for .npmrc, which contains your scope information, including user name an encrypted password. Copy this and paste it into the file you created in the previous step. For reference, the snippet should look something like this (but **don't copy the one below** - because it contains dummy information!):

```shell
@<SCOPE>:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:_password=AAAbbbCCCdddEEEfffGGGhhhIIIjjj111222333444555666777=
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:username=john.doe
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:email=john.doe@company.com
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:always-auth=true
```

8. Replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

9. Save the file and under the directory path of this `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If the set-up wass successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```
:::caution trouble running npm?
Please make sure:
- you have the correct versions of the software packages, especially node and npm, as explained in the [workstation setup](/getting-started/developer-training/environment-setup/#required-software-packages). If you have an older version of npm (run 'npm -v'), make sure you uninstall it first.
- if you're behind a corporate network, you may need to setup a proxy:
```shell
npm config set proxy http://proxy_host:port
npm config set https-proxy https://proxy_host:port
npm config set https-proxy http://proxy_host:port
```
:::

10. Install GenX CLI; this is a Genesis tool that enables you to seed projects.
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


  GenesisX CLI V2.0.0

  ? Genesis Password: 
```

Enter the same password you used in step 6 and then you should see this message:
```shell
√ Logged into Genesis
```

Feel free to abort this program for now - we'll use genx later on.

:::caution trouble running GenX?
If you run into problems running GenX, especially errors like `unable to get local issuer certificate` or `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, it means there are issues to download packages from Artifactory due to restrictions when behind a corporate proxy.

As an alternative, you can [download the project structure that would be generated by GenX](https://genesisglobal.jfrog.io/artifactory/community-uploads/alpha.zip) and move on with this guide.   
:::

### Gradle setup
Make sure you have a **gradle.properties** file inside a **.gradle** folder in your user directory; this file must contain your password in clear (unencrypted) text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```

Use the same credentials you used in *step 6* above.
:::caution proxy settings
If you are behind a corporate proxy, make sure you add your proxy settings to the **gradle.properties** file as well. For example:
```shell
systemProp.https.proxyHost=proxy_hostname_here
systemProp.https.proxyPort=proxy_port_here
systemProp.https.proxyUser=your_proxy_user_here
systemProp.https.proxyPassword=your_proxy_password_here
#if behind an NTLM authenticated proxy, add the next line:
#systemProp.https.auth.ntlm.domain=your_network_domain_here
```

If you are unsure about what settings to use, please contact your IT support.

More information [here](https://docs.gradle.org/current/userguide/build_environment.html#sec:accessing_the_web_via_a_proxy).
:::

## Local server set-up

<!--
Make sure you have completed the [Workstation setup](#workstation-setup) prior to this.

We are going to set up Windows Subsystem for Linux (WSL 2) to deploy and run the application locally.

You can install everything you need to run WSL by entering this command in an administrator PowerShell or Windows Command Prompt and then restarting your machine.
```
wsl --install
```
Microsoft provides [documentation on the WSL installation](https://docs.microsoft.com/en-us/windows/wsl/install), if you need it.

Then download the [Genesis WSL training distro](https://genesisglobal.jfrog.io/artifactory/community-uploads/training-wsl.zip). This distro contains everything you need to get started, including:
Linux CentOS 7 base, Java 11 SDK, genesis user, nginx, FoundationDB.

Now create a local folder where you want to run the distro, e.g., "C:\wsl\distros\training-distro\". Unzip the package downloaded there and from that folder, run:
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
-->
### Start the project baseline

Clone the Developer Training starting repo from [here](https://github.com/genesiscommunitysuccess/devtraining-seed).

Open the project using your favorite IDE, such as IntelliJ or Visual Studio Code.

### Running the back end
We are going to change the back-end and front-end code, so ideally we should have the server running to make our application work. To do that, we can simply build a Docker image from the project you just cloned.

You must have Docker installed and running on your workstation.

### Building the Docker images
From the root directory of the project, run:
```shell
./gradlew assemble
docker-compose build
docker-compose up -d
```

Check on your Docker dashboard to make sure that you have the containers **gsf** and **nginx** running.

### Attaching a terminal to a Docker container

Attaching a terminal to a Docker container is as easy as running:

```shell
docker exec -it gsf bash
```

Now try logging in as **alpha** and running `mon` to monitor the platform services.
```shell
su - alpha

mon
```

:::tip
Alternatively, you can use Docker Desktop Integrated Terminal for the containers you have just created (as explained [here](https://www.docker.com/blog/integrated-terminal-for-running-containers-extended-integration-with-containerd-and-more-in-docker-desktop-4-12/)).
:::

When you run `mon`, you must see all processes up and running or in standby mode.

You are good to go!


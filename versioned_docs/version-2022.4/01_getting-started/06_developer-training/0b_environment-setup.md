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
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setting up your workstation and a local server

### Workstation set-up

Please follow these instructions very carefully to ensure your environment is ready for a productive training. It's not necessary to have admin rights on your workstation to develop with the Genesis low-code platform, but you might have to check with your System Administrator how to install the required third-party software listed here.

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
| Rancher Desktop | 1.8.1 |

You can use a range of IDEs (for example, Eclipse) with the Genesis low-code platform, but only IntelliJ enables you to make full use of the Genesis Platform Abstraction Language (**GPAL**) prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

###  Accessing the Genesis repository and configuring the Genesis packages
#### .npmrc set-up

:::note
For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry.

This requires credentials for accessing Genesis Artifactory. If you have not been provided with the credentials, please contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login). It's not possible to complete the training without this access, because you won't be able to download the Genesis platform components and build your project.

To follow the instructions below, select **External User** if you are a Genesis customer or partner, or **Internal User**  if you are a Genesis employee with an internal Genesis account.
:::

<Tabs defaultValue="external" values={[{ label: 'External User', value: 'external', }, { label: 'Internal User', value: 'internal', }]}>
<TabItem value="external">
This setup presumes you will sign in with jfrog user and password parameters. Please follow the steps:

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
`npm info @genesislcap/foundation-ui`. If the set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```
:::caution trouble running npm?
Please make sure:
- You have the correct versions of the software packages, especially node and npm, as explained in the [workstation setup](../../../getting-started/developer-training/environment-setup/#required-software-packages). If you have an older version of npm (run 'npm -v'), make sure you uninstall it first.
- If you're behind a corporate network, you may need to setup a proxy:
```shell
npm config set proxy http://proxy_host:port
npm config set https-proxy https://proxy_host:port
```
:::

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

Launch GenX CLI; this is a Genesis tool that enables you to seed projects.

```shell
npx @genesislcap/genx@latest
```

You should see this message:
```shell


   ______                     _     _  __
  / _______  ____  ___  _____(_____| |/ /
 / / __/ _ \/ __ \/ _ \/ ___/ / ___|   /
/ /_/ /  __/ / / /  __(__  / (__  /   |
\____/\___/_/ /_/\___/____/_/____/_/|_|


  GenesisX CLI VX.X.X

  ? Genesis Password: 
```

Enter the same password you used in step 6 and then you should see this message:
```shell
√ Logged into Genesis
```

Feel free to abort this program for now - we'll use genx later on.

<!-- NO EDIT (NEXT 4 LINES) -->
import InsecureFlag from '../../_includes/_cli-insecure-flag.md'

<InsecureFlag />

:::tip

As an alternative, you can [download the project structure that would be generated by GenX](https://genesisglobal.jfrog.io/artifactory/community-uploads/alpha.zip) and move on with this guide.   

:::

### Gradle set-up
Make sure you have a **gradle.properties** file inside a **.gradle** folder in your user directory; this file must contain your encrypted password:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```

:::info Password
It is also possible to input your unencrypted password, but it is *not recommended*.
:::

Use the same credential you used in *step 6* above.
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

If you are unsure on what settings to use, please contact your IT support.

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

Open the project using your favourite IDE such as IntelliJ or Visual Studio Code.

### Running the back end
We are going to change the back-end and front-end code, so ideally we should have the server running to make our application work. To do that, we can simply build a Docker image from the project you just cloned.

You must have a docker container management software installed (we recommand [Rancher Desktop](https://rancherdesktop.io/)) and running on your workstation.

### Building the docker images
From the root directory of the project, run:
```shell
./gradlew assemble
docker-compose build
docker-compose up -d
```

Check if you have the containers **gsf** and **nginx** running. Copy and paste the following commands into the terminal

```Powershell
docker ps --format '{{ .ID }}\t{{.Image}}\t{{ .Names }}' 
```

### Attaching a terminal to a Docker container

Attaching a terminal to a docker container is as easy as running:

```shell
docker exec -it gsf bash
```

Now try logging in as **alpha** and running `mon` to monitor the platform services.
```shell
su - alpha

mon
```

:::tip
Alternatively, you can use Rancher Desktop Integrated Terminal for the Containers you just created as explained [here](https://www.docker.com/blog/integrated-terminal-for-running-containers-extended-integration-with-containerd-and-more-in-docker-desktop-4-12/).
:::

You must see all processes up and running or in standby mode.

You are good to go!


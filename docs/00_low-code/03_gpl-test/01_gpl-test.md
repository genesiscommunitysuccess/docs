---
title: 'gpl-test README'
sidebar_label: 'gpl-test README'
id: gpl-test-readme
---

# Sample DSL-based application

Sample application based on [DSL seed](https://github.com/genesislcap/gpl-seed/).

## Web Build Quick Start

To install/update dependencies:

```sh
./gradlew :npmBootstrap
```

The start the development build in watch mode:

```sh
./gradlew :npmStart
```

to start the generation of the ui json (Note: you must have the gpl plugin enabled in `hello-world/settings.gradle.kts`): 
```shell
./gradlew :hello-world:generateIR -t
```
this task will start in the background and listen to changes

## Other codegen tasks

to generate the genesis processes' config:
```shell
./gradlew :hello-world:generateConfig
```

to generate the genesis dataserver script:
```shell
./gradlew :hello-world:generateDataServer
```

to generate the genesis eventhandler script:
```shell
./gradlew :hello-world:generateEventHandler
```

to generate everything:
```shell
./gradlew :hello-world:generateAll
```

## Gradle plugin

To deploy the gradle settings plugin to your local maven repo; run: 
```shell
./gradlew :server:gpl-gradle:publishToMavenLocal 
```

## End-to-End development using the gpl-test project

This section describes how to change the gpl-server project, import to the gpl-test project then verify the changes in gpl-ui.

## Setting up the Centos VM

If you have a working genesis environment deployed to a VM you can skip this section

- Reset the WSL image to the base image

```shell
wsl --unregister CentOS7
wsl --import CentOS7 CentOS7 .\centos.backup
```

- Add the gpl-test user to the Centos VM

```shell
useradd hello
usermod -aG wheel hello
```

- Add foundation DB to the Centos VM (Note we will be switching to PostGres later, but a database is required to run setUpEnvironment)

```shell
rpm -Uvhi https://github.com/apple/foundationdb/releases/download/6.3.23/foundationdb-clients-6.3.23-1.el7.x86_64.rpm
rpm -Uvhi https://github.com/apple/foundationdb/releases/download/6.3.23/foundationdb-server-6.3.23-1.el7.x86_64.rpm
mv /usr/bin/systemctl /usr/bin/systemctl.old
curl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/master/files/docker/systemctl.py > /usr/bin/systemctl
chmod +x /usr/bin/systemctl
systemctl enable foundationdb
systemctl start foundationdb
fdbcli --exec "configure new single memory ; status"
systemctl status foundationdb
```

- Enable WSL integration via Docker Desktop

```text
Click the Settings Cog
Resources > WSL Integration > Centos7 > Apply & Restart
Run 'docker' on Centos VM to verify
```

- Add a PostGres DB (we will change the config to use this later)

```shell
# On Centos
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c shared_buffers=80MB -c max_connections=250
```

- Start a docker proxy started on the Centos VM, this will allow a websocket connection between your local and Centos VM

```shell
# On Centos
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(ifconfig eth0 | grep inet | grep -v inet6 | awk '{print $2}') genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
```

## Changing gpl-server and gpl-test project

In this example we are going to add a new 'section' element type to the DSL. Then verify the HTML element exists in the UI.

1. Add the 'section' method to the **ElementContainer.kt** in gpl-server.

```kotlin
fun section(text: String? = null, handler: (ElementContainer<*>.() -> Unit) = {}) {
    handleNullableTitleElement("section", text, UIElement::GenericElement, handler)
}
```

2. Change the version in the gpl-server **build.gradle.kts** file. Here we are changing SNAPSHOT to TEST.

```kotlin
version = "0.0.10-TEST"
```

3. Build the gpl-server project to create a jar file. This should be created in ~/gpl-server/{module}/build/libs

```shell
./gradlew assemble
```

4. Once the build task completed we need to publish the jars to the maven repository then we can reference the jar in the gpl-test project.
When complete we should see the jar in our local maven repository. eg. C:\Users\{UserName}\.m2\repository\global\genesis\gpl-api\0.0.10-TEST

```shell
./gradlew publishToMavenLocal 
```

5. In the gpl-test **gradle.properties** file, change the version number

```text
gpl-version=0.0.10-TEST
```

6. Rebuild the gpl-test project to bring in the new gpl-server jar
```shell
./gradlew assemble
```

7. Now we can utilize the new section tag we have added. Add the section tag into the **HelloWorldApplication.kt** file 

```kotlin
defaultPage("Home") {
                // ... Other tags
                section("A new section element")
                
            }
```

8. Run the gradle generate task to generate the IR
```shell
./gradlew :hello-world:generateAll
```

## Deploying to the server

1. Deploy the gpl-test genesis server by running the following gradle tasks
```shell
./gradlew setupEnvironment
./gradlew install-auth-distribution.zip
```

2. Update /home/hello/run/site-specific/cfg/genesis-system-definition.kts
```shell
item(name = "DbLayer", value = "SQL")
item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/?user=postgres&password=docker")
```

3. Deploy the application and verify the processes
```shell
./gradlew deploy-genesisproduct-gpl-test.zip
./gradlew mon
```

4. Copy user.csv to the centos box (You will need the quick start project created via genx to access this)

```shell
copy  C:\test-gen\alpha\server\jvm\alpha-site-specific\src\main\resources\data\user.csv \\wsl$\CentOS7\home\hello\user.csv
```

5. Use the SendIt tools to load into PostGres

```shell
sudo su hello
cd ~
SendIt -t USER -f user.csv
```

## Running gpl-ui

1. We should now have an app.json file under ~\gpl-test\node_modules\@genesislcap\gpl-ui-web\dist\app.json, verify it contains the new section property.

2. Copy the contents of app.json file to ~/gpl-ui/web/public/app.dev.json replacing the existing text.

3. Run npm to start the web server. 
4. 
```shell
npm run bootstrap
npm run web
```
4. Login with the following details

```text
JaneDee
beONneON*74
```

5. If we log in to the application we should see the section tag added!

## Debugging the gpl-ui in IntelliJ (Ultimate Only)

In this section we will verify the new section tag in has been added to the site by debugging the code

Add the below configurations

```text
Edit Configuration
Click '+' symbol
npm 
Set package.json ~\gpl-ui\web\package.json
Set Scripts dev:webpack
Click Run
```


```text
Edit Configurations 
Click '+' symbol
JavaScript Debug
Set Url: http://localhost:5000
Click Ok
Click Debug 
```

We need both of these configurations running at the same time in order to debug in IntelliJ

(Note) Weird issue where when running Chrome via IntelliJ you have to change the web socket url to ws instead of wss

```typescript
// In config.ts remove the 's' from wss
getHostUrl = (appConfig) => appConfig.server?.url || `ws://${location.hostname}/gwf/`;
```


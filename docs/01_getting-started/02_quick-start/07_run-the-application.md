---
title: 'Run the application (WSL/Linux)'
sidebar_label: 'Run the application (WSL/Linux)'
id: run-the-application
---

You have a choice of how you run the application. The instructions on this page are for using WSL/CentOS. If you prefer to use Docker as your environment, there are [separate instructions](/getting-started/quick-start/run-the-application-docker/).

Before you start this, make sure that:

- you have a user with the name of the application (alpha)
- foundationdb is running (if it is not, run `systemctl start foundationdb` from Centos07)

If that's OK, you can deploy the server.

## Deploying to the server

First, we need to configure our genesis home, distribution and user. We will do that by adding the following fields to the **gradle.properties** under **alpha/server/jvm**

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

We will run `setupEnvironment` - this task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :
```shell
./gradlew :jvm:alpha-deploy:setupEnvironment #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/setup-environment.png)

After this command is completed we will have a basic genesis server running

## Deploying the auth module

Usage:
```shell
./gradlew :jvm:alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/install-auth.png)

## Deploying the alpha product (FDB)

Now we have to deploy the alpha product

Usage:
```shell
./gradlew :jvm:alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/deploy-alpha-product.png)

## Deploying the alpha product (H2)

Now we have to install the site-specific alpha product.

From the terminal:
```shell
./gradlew :jvm:alpha-deploy:install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/install-alpha-site-specific.png)

Next, we need to run `genesis-install`.

Usage:
```shell
./gradlew :jvm:alpha-deploy:genesis-install #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/alpha-genesis-install.png)

Then we run `remap`.

Usage:
```shell
./gradlew :jvm:alpha-deploy:remap #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/remap.png)


## Connecting the back end and front end

With this next step, we will configure an nginx server working as a reverse proxy.

1. In your CentOS terminal, enter:
```shell
docker login genesisglobal-docker-internal.jfrog.io
...

You need to enter your artifactory credentials at this point

2. Then enter:
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

3. Finally, enter:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

## Running the front end


Now you can run the application's front end. From there, you can view the table of data and add the details of a new trade.

To run the application:

From **client/package.json**:
- Run **bootstrap** script

After that:
- Run **dev** script

Now you have a fully running application. If not opened automatically, you can navigate to http://localhost:6060/login, and you should see the following:

![](/img/login-screen-quickstart.png)

:::tip
If the blue button to login is not clickable, go through the previous section again, the problem will most likely be located there.

::::

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there. We hope you have a good experience.


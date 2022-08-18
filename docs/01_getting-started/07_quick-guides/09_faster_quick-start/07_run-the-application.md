---
title: 'Run the application'
sidebar_label: 'Run the application'
id: run-the-application
---

### Assembling the distributions

Finally, you can build the server distributions.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**Tasks**/**Build/Assemble**.

![](/img/assemble-server.png)

### Building and composing Docker images 

Usage:
```shell
docker-compose up -d #On the IntelliJ terminal
```

### Accessing the application

After everything has been built and deployed on Docker containers, the frontend is accessible on 

Usage:
```shell
http://localhost:6060
```

Once the server has successfully started all the components on the docker container, you may log in

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there. We hope you have a good experience.


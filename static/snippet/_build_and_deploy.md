In the Gradle menu on the right of IntelliJ, select:

**genesisproduct-alpha**

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```
As soon as the Build is done, you can apply the changes and run the Genesis processes again using the Genesis IntelliJ Plugin.

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

3. Once the build is successful, you’ll be asked to start the Resource daemon again:

![Genesis Install](/img/intellij-daemon.png)

4. Once the Resource daemon starts, you can start the processes you wish to have running.
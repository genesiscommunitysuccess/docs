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
wsl --import TrainingCentOS . training-wsl-fdb.backup
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

:::tip FoundationDB
In our Genesis WSL training distro we are using [FoundationDB](https://github.com/apple/foundationdb) as the database provider. FoundationDB comes with a command line interface tool called [fdbcli](https://apple.github.io/foundationdb/command-line-interface.html). You can invoke fdbcli at the command line simply by typing it. If everything is ok, you should see a message *The database is available.*

```
$ fdbcli
Using cluster file `/etc/foundationdb/fdb.cluster'.

The database is available.

Welcome to the fdbcli. For help, type `help'.
fdb>
```

In case of any issue, please double check how the FoundationDB [configuration](https://apple.github.io/foundationdb/configuration.html) can be done. E.g., each FDB cluster needs to be told some configuration information about what kind of redundancy mode it should be using, what storage engine, etc. For local development, you’ll probably want to run the command below.

```shell
fdbcli --exec "configure new single memory ; status"
```

Last but not least, feel free to try different versions of FoundationDB [here](https://apple.github.io/foundationdb/downloads.html). You may also want to re-start your local FoundationDB.

```shell
pkill fdb
/usr/lib/foundationdb/fdbmonitor >> /tmp/fdbmonitor.log 2>&1 &
fdbserver -p 127.0.0.1:4500 >> /tmp/fdb.log 2>&1 &
```
:::


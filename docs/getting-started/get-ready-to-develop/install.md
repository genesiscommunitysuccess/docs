---
id: install
sidebar_label: Install in three easy steps
sidebar_position: 20
title: Install in three easy steps

---
To install the Genesis LCNC Platform on your server, go through the following steps.

* Make sure you have the correct infrastructure for installing the platform.
* Install the Genesis platform.

That is it. Once you have an installed platform in the correct environment, you are ready to start developing.

We  describe the recommended steps below, but you can also see the process in a neat 10-minute video.

<iframe src="https://player.vimeo.com/video/590505594?h=5a99336928" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>

## Installing from an rpm

You must start with a server with the operating system and relevant packages installed. Genesis supplies the rpm to simplify the installation. Everything you need is in the rpm, and nothing is downloaded when you install it.
To install the rpm, you need a privileged user account.
In our example, the rpm is called **genesis-platform-5.1.0-1.x86_64.rpm**.

### 1. Give the user account a name

By default, the installation creates an application user account called **genesis**. You can change this change this before you start by editing the file **genesis_install.conf**. For example, to change the user account to be created to octopus, edit it as follows:

```bash
echo "genesis_user=octopus" >> /tmp/genesis_install.conf
```

### 2. Install the rpm

Now you can `sudo yum` and install the rpm.

```bash
sudo yum --nogpgcheck localinstall genesis-platform-5.1.0-1.x86.rpm
```

This creates the user account and makes all the recommended security settings. Additionally, it creates the required directory structure and unpacks all the zipped files.

When the process has finished, you can go to the root directory and see the user that has been created (octopus, in our example).

![](/img/joseph-3completed-installation.png)

You can switch to that user and view the run directory for the newly installed platform, where you can find **auth** and **genesis** ready to be initialized.

![](/img/joseph4-ready-to-initialize.png)

### 3. Run genesisInstall

The script does all the hard work for you. Just run `genesisInstall`.

The initialization process creates new directories. In addition to **auth** and **genesis**, you will see:
* **generated**
* **runtime**
* **site-specific**

The process also creates some useful tools. Most immediately, try `mon` to see the processes that need to be run.

![](/img/joseph5-mon.png)

At this point, no processes are running. So, run the command `startServer`. When it is complete, run `mon` again. This time, you can see all the processes running.

![](/img/mon-processes-running.png)

That’s it. You are now ready to start developing. Congratulations.
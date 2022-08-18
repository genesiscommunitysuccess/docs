---
title: 'Create New Project'
id: create-new-project
---

# Create New Project

To help give you a helping hand in getting started with your applications, our GenX CLI tool will allow you to create seed projects. 

> A seed project is a productive starting point for any application with our Unified DSL. 
> 
> It will create an initial file structure and install any necessary dependencies, allowing you to focus on the important bits. 

### Expected Result
By the end of this step, you should:
- Have GenX CLI installed and available on any terminal
- created a new project named *alpha* with any relevant application configuration set up

This will start you on your journey to building application functionality.

## GenX CLI

### Installation
Let's start by installing GenX using the following command in your terminal:

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@2.0.1-alpha-c5193cd.0+c5193cd
```
:::note
Our DSL seed is currently only available on a particular version, therefore we need to remove any previous version and specify the one we need.
:::


### Choosing Project Type

Now we are ready to generate our seed project.

From the terminal, run:

```shell
foundation-cli
```

If this is your first time running our CLI tool, you'll need to provide your artifactory credentials. 

> No credentials? See our [Prerequisites](low-code/introduction/prerequisites/)

```shell
? Genesis Username example.username
? Genesis Password **************
√ Logged into Genesis
```

:::tip
We persist your details to help speed things up, so you won't need this everytime.
:::


Select `create Low-Code application`:

```shell
? Please select an option: (Use arrow keys)
> create Low-Code application - Creates a Low-Code application.
  create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
  create application - Generates a local application.
  configure application - Configure a local app.
```

### Configuring the Seed
We now want to configure our seed. There will be a number of fields to fill in to help us get the best possible start.


:::tip 
If you see any answers in bold, this is the default answer, you can just hit enter to use it.
:::

Lets choose the location and name for our project. In this case, our current directory and our application name will be **alpha**.

```shell
? Create an app in current directory Yes
? App name alpha
```

We want to have a clean install, so let's overwrite any previous installations, choosing 'Yes'. The following prompt will be skipped, if this is the first time you are creating an application with this name. 

```shell
? Overwrite existing files (y/N) Yes
```

The seed application is now created and dependencies are installed. Our expected output should be:

```shell
? Overwrite existing files Yes
✔ Create path alpha
✔ Create directory alpha
✔ Creating from seed 'Low-code Application Seed'
ℹ Installing dependencies.
✔ Install success.
```

### Configuring the application

We can now configure the application starting with NPM module settings. 

This will ensure we pull our Genesis packages to help support your development.

```shell
? NPM package scope (genesislcap)
? NPM package name (alpha)
```

Next, you will be asked whether you want to configure an API host. 

> By default, our web component will attempt to connect to your local server. If you want to connect to a remote server instead, choose Yes and specify WebSocket URL.

<span style={{color:'red'}}>We should explain this better</span>

```shell
? (Optional) Override the default API Host URL (N/y)
```

Continue with the remaining questions:
<span style={{color:'red'}}>Continue what? What do we choose?</span>

```shell
? Genesis Server version
? Auth Server version
? GPL version
? Kotlin version
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```

At this point, the application will be configured. If successful, you will see the following:

```shell
✔ Configuring Seed
✔ Writing environment variables
ℹ Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```

Now open your chosen IDE (e.g. IntelliJ) and locate the newly created alpha project. Have a look at **README.md** for more information about the project created. 

## Recap

Congratulations, your local environment is now ready to build applications. We have:

- Installed GenX CLI
- Created a new Low-Code seed project
- Configured our seed
- Configured our application defaults

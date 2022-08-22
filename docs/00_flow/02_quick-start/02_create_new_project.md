---
title: 'Create New Project'
id: create-new-project
---

# Create New Project

To help give you a helping hand in getting started with your applications, our [GenX CLI](/flow/introduction/prerequisites/#genx-cli)  tool will allow you to create seed projects. 


> A seed project is a productive starting point for any application using Flow. 
> 
> It will create an initial file structure and install any necessary dependencies, allowing you to focus on the important bits. 
:::note 
> Install the [GenX CLI](/flow/introduction/prerequisites/#genx-cli) before proceeding with the following steps.
:::

### Expected Result
By the end of this step, you should have:
- created a new project named *alpha* with any relevant application configuration set up

This will start you on your journey to building application functionality.

### Choosing Project Type

Once the GenX CLI has been installed, we are ready to generate our seed project.

From the terminal, run:

```shell
foundation-cli
```

If this is your first time running our CLI tool, you'll need to provide your artifactory credentials. 

> No credentials? See our [Prerequisites](/flow/introduction/prerequisites/)

```shell
? Genesis Username example.username
? Genesis Password **************
√ Logged into Genesis
```

:::tip
We persist your details to help speed things up, so you won't need this everytime.
:::


Select `create flow application`:

```shell
? Please select an option: (Use arrow keys)
> create flow application - Creates a Flow application.
  create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
  create application - Generates a local application.
  configure application - Configure a local app.
```

### Configuring the Seed
We now want to configure our seed. There will be a number of fields to fill in to help us get the best possible start.


:::tip 
In some instances, you will see grey text reflecting possible answers to the prompted question. The capitalized option is the default so you can just hit enter to use it. 
For example `y/N`: default here is 'No'
:::

Lets choose the location and name for our project. In this case, our current directory and our application name will be **alpha**.

```shell
? Create an app in current directory Yes
? App name alpha
```

We want to have a clean install, so let's overwrite any previous installations, choosing 'Yes'.
> If this is the first time you are creating an application with this name, the following prompt will be skipped.

```shell
? Overwrite existing files (y/N) Yes
```

The seed application is now created and dependencies are installed. Our expected output should be:

```shell
? Overwrite existing files Yes
✔ Create path alpha
✔ Create directory alpha
✔ Creating from seed 'Flow Application Seed'
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

> Our web component will attempt to connect to your local server. If you want to connect to a remote server, choose Yes and specify WebSocket URL. Otherwise, hit enter and the web component will connect to your local server by default. 

<span style={{color:'red'}}>We should explain this better</span>

```shell
? (Optional) Override the default API Host URL (N/y)
```

Continue with the remaining prompts:
> Hit enter and the default versions will be selected. If you want to use a different version, simply add the version next to the prompt and hit enter. 
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

- Created a new Flow seed project
- Configured our seed
- Configured our application defaults

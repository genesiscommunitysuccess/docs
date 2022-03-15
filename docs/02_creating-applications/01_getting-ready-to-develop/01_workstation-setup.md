---
id: workstation-setup
sidebar_label: 'Workstation setup'
sidebar_position: 1
title: 'Workstation setup'
---

Genesis Application Developers need to access on-premise workstations through remote technologies like Citrix, VMware etc.

## Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

## Recommended software packages

| Package	| Minimum Version| 
|--------------|:-----:|
| IntelliJ	| 2020.2.4|
|Visual Studio Code	| 1.52.1|
|Java SDK| 11|
| Putty	| 0.74|
| Chrome | 88.0|
| Maven	| 3.6.3|
| Postman	| 8|
| Gradle  | 6.8|
| Nodejs  |14|

Note that you can use a range of IDEs (for example, Eclipse) with the LCNC Platform, but only IntelliJ enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

## Requirements

* NodeJS (16 LTS+) - https://nodejs.org/en/
* npm 8 (installed with NodeJS)

## .npmrc token

Access to the Genesis packages on Github requires you to configure the `@genesislcap` scope of `npm` to use our
registry. You will need to obtain a token to access these, and this may be a per developer token or one that is assigned
to your company as a whole. [Request a token](https://genesis.global/contact-us/).

Once you have a token you have a couple of options on how to configure the `@genesislcap` scope to use our registry:

**Global Set Up** - Globally set these values, so it works in any project:

```shell
npm config set "@genesislcap:registry" https://npm.pkg.github.com/
```

```shell
npm config set "//npm.pkg.github.com/:_authToken" TOKEN
```

**Localised / Per-Project** - If you’d prefer a more localised or per-project setup, simply create a `.npmrc` file in or
above your intended workspace directory and run the npm commands from within this directory structure. This way npm will
find and apply these settings to allow you to install our packages.

If you already have a project, you can ultimately place this `.npmrc` file alongside the project's `package.json` file.

```shell
@genesislcap:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=TOKEN
```
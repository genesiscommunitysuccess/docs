---

---
# Set-up

## Requirements

* NodeJS (14 LTS+) - https://nodejs.org/en/
* npm 7+ (installed by NodeJS) setup for artifactory access

## Setting up npm

The contents of the .npmrc in your home folder

    @genesisglobal:registry=https://genesisglobal.jfrog.io/artifactory/api/npm/npm-local/
    //genesisglobal.jfrog.io/artifactory/api/npm/npm-local/:_password=<pass here>
    //genesisglobal.jfrog.io/artifactory/api/npm/npm-local/:username=<user here>
    //genesisglobal.jfrog.io/artifactory/api/npm/npm-local/:email=user.name@genesis.global
    //genesisglobal.jfrog.io/artifactory/api/npm/npm-local/:always-auth=true

Normally, you can go to the artifactory website, login, click on npm-local and click 'Set me up' in the top right corner
of the npm-local workspace.

Currently, there are no dependencies on private packages in artifactory.

## Running

Clone the code into its own directory and install its dependencies. You may want to checkout the develop branch
first.

```bash
$ npm i
$ npm start
```

Creating a deployable stand-alone build of the UI:

    $ npm run build

This will create a stand-alone version of the app that can be deployed, normally into a sub-directory called `./build`
You can take this and deploy it on any domain or github pages.

### Developer tools

You will benefit from installing the following react extensions:

* React Dev tools
* React Redux Dev tools
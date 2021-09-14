---
id: set-up
sidebar_label: Set-up
sidebar_position: 4
title: Set-up

---
## Requirements

* NodeJS (14 LTS+) - https://nodejs.org/en/
* npm 6+ (installed with NodeJS)

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
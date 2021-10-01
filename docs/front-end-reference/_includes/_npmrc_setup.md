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
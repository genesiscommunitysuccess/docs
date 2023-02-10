# Genesis platform documentation

Documentation is written using [Markdown format](markdown-syntax.md).

### Installation

```
npm i
```

### Local development

```
npm run start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

Note that you need to prefix your url with /next/ in order to see your updated changes locally. e.g. `http://localhost:8080/next/operations/containerisation/healthchecks/`

### Build

```
npm run build
```

This command generates static content into the **build** directory.

### Clear

```
npm run clear
```

This command clears the Docusaurus generated assets, caches, build artifacts etc. (useful if you're not seeing your changes in the browser).

### Regenerating `bundle`

To generate a new bundled file, simply run the following command from the package you wish to access.

```
npm run build
```

For example, in the `foundation-ui` repo we run the command above on the **documentation-components** under the **showcase** folder.

***
Ensure the package you intend to regenerate the file from has all the necessary dependencies.
***
Once you have the new regenerated file, paste the contents to [docs.iife.min.js]( static/js/docs.iife.min.js)

### Copy FE docs

Front-end documentation from `foundation-ui` can be pulled into this repo. Follow these steps

1. Add as a dependency in `./package.json`
2. Setup the config in `./plugins/api-docs/manifest.json`
3. Set up the sidebar
4. Run with `$ npm run start:copy-docs`

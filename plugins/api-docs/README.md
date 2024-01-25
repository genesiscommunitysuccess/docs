# API-Docs Plugin

This is a custom docusaurus plugin to move the api docs and readme files from select foundation-ui npm packages into the
docs project.

Create a manifest ts file containing the package and output information of each package you wish the plugin to process.
```json
{
  "packages": [
    {
      "name": "@genesislcap/foundation-testing",
      "enabled": true,
      "api_docs": "./docs/api",
      "readme": "./README.md",
      "output": {
        "title": "Foundation Testing",
        "sidebar_label": "Foundation Testing",
        "id": "foundation-testing",
        "directory": "./docs/04_front-end/06_testing",
        "api_docs": "docs/api",
        "readme": "01_foundation-testing.md",
        "keywords": [
          "genesis", "foundation", "ui", "testing"
        ],
        "tags": [
          "test", "testing", "frontend", "ui", "unit", "end-to-end", "e2e", "uvu", "playwright"
        ]
      }
    }
  ]
}
```

Supply the manifest js file and a processedMap object to the plugin during bootstrap:

```js
// docusaurus.config.js
const processedMap = {
    /**
     * Required instance between hot reloads.
     *
     * Adding a package name and version key value pair here will stop your package from re-processing, as will
     * disabling it in the manifest json.
     */
}
module.exports = {
    plugins: [
        ...
        [require.resolve('api-docs-sync'), {
            manifest: require(require.resolve('api-docs-sync/manifest')).default,
            processedMap: require(require.resolve('api-docs-sync/processedMap')).default,
        }],
    ],
    ...
}
```

## Usage

Use `npm run build` and `npm run build:watch` to transpile the typescript `/src` files to `dist/*.js` files for docusaurus to use.

We are checking in the javascript files in `/dist` so the wider learn team do not need to worry about extra build steps to initialise this package before running docusaurus.

## TODOs

* Run the plugin only once in both dev and prod mode.
* Create sidebars menu item dynamically for each item and include it in the main sidebars.js.
* Move the micro frontends packages api docs inclusion over to this manifest type setup.
* Add foundation-store and other packages.

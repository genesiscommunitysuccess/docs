# Genesis platform documentation

Documentation is written using [Markdown format](markdown-syntax.md).

## Contribution

Now our community team is accepting contributions from all community members of Genesis. All accepted contributions will be published on our [official website](https://docs.genesis.global/).

Please check our [Contribution guide](https://www.notion.so/genesisglobal/Contributing-new-documentation-75953fb245f246ff872789035451a0c4) on Notion. 

If you are willing to contribute, please follow the links below:
- [Internal contributor](./how-to-contribute-Internal.md) if you are an internal contributor currently working at Genesis.
- [External contributor](./how-to-contribute-external.md) if you are an external contributor not currently working at Genesis.

## Stack Overflow

We have a Stack Overflow community. If you have a [Genesis Login](https://stackoverflowteams.com/users/login?ssrc=channels&returnurl=%2fc%2fgenesis-global%2fquestions), take a look. Or, click here to get a [new genesis login](https://genesis.global/contact-us/). We are encouraging our teams, customers and contributors to participate in this community. 

## Installation

```
npm i
```

## Local development

```
npm run start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

### Build

To generate the static files for deployment, you can run the build as below.

For a complete build, execute `npm run build`:
```
npm run build
```

If you prefer to run a local build only, we recommend using `npm run build-main`:
```
npm run build-main
```

Both commands generate static content into the **build** directory.

### Preview

 To run a local development server for previewing and testing your Docusaurus site during development, you can run the command below

 ```
 npm run serve
 ```

### Clear

```
npm run clear
```

This command clears the Docusaurus generated assets, caches, build artefacts etc. This is useful if you're not seeing your changes in the browser.

## Regenerating `bundle`

To generate a new bundled file, simply run the following command from the package you wish to access.

```
npm run build
```

For example, in the `foundation-ui` repo we run the command above on the **documentation-components** under the **showcase** folder.

***
Ensure the package you intend to regenerate the file from has all the necessary dependencies.
***

Once you have the new regenerated file, paste the contents to [docs.iife.min.js]( static/js/docs.iife.min.js)

## Copy FE docs

Front-end documentation from `foundation-ui` can be pulled into this repo. To this, follow the steps below:

1. Add as a dependency in `./package.json`.
2. Set up the config in `./plugins/api-docs/manifest.json`.
3. Set up the sidebar.
4. Run with `$ npm run start:copy-docs`.
5. Once you have got feedback on the docs, you can lock it in via `./plugins/api-docs/processedMap.js`.

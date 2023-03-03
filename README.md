# Genesis platform documentation

Documentation is written using [Markdown format](markdown-syntax.md).

## Contribution

Now our community team is accepting contributions from all community members of genesis. All accepted contribution will be published to our [official website](https://learn.genesis.global/).

For more details about what [types of contribution](./Type-of-contribution.md) we are accepting, please follow the link. 

If you are willing to contribute, please follow the links below:
- [Internal contributor](./how-to-contribute-Internal.md) if you are an internal contributor currently working at Genesis.
- [External contributor](./how-to-contribute-external.md) if you are an external contributors not currently working at Genesis.

## Stack Overflow

We have a Stack Overflow community, take a look if you have a [Genesis Login](https://stackoverflowteams.com/users/login?ssrc=channels&returnurl=%2fc%2fgenesis-global%2fquestions) or click here to get a [new genesis login](https://genesis.global/contact-us/). We are encouraging our teams, costumers and contributors to participate to this community. 

## Installation

```
npm i
```

## Local development

```
npm run start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

Note that you need to prefix your url with `/next/` in order to see your updated changes locally. For example, `http://localhost:8080/operations/containerisation/healthchecks/` shows the most recently published docs version.  To view the next version - the one that will be published at the next platform release, add `/next/` to beginning of the url. For example, `http://localhost:8080/next/operations/containerisation/healthchecks/`

### Build

```
npm run build
```

This command generates static content into the **build** directory.

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

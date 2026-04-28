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


## API docs for front-end packages

API documentation for `@genesislcap` packages is generated directly in this repo from the `.api.json` files published inside each package. See [scripts/README.md](scripts/README.md) for full details.

The pipeline is: `TypeScript source → api-extractor → .api.json (published to npm) → api-documenter (runs here) → .md files (committed to this repo)`.

### Generate docs after an `npm install`

```bash
npm run generate:api-docs
```

Regenerate everything from scratch:

```bash
npm run generate:api-docs -- --force
```

### Sync to the latest package versions (full automation)

```bash
# Check for newer versions, generate docs — no git operations
npm run sync-api-docs

# Version bump + npm install + generate + branch + commit + push + PR
npm run sync-api-docs:full
```

The full automation runs on a daily schedule via GitHub Actions.

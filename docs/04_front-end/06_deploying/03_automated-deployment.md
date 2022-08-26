---
title: 'Automated Deployment'
sidebar_label: 'Automated Deployment'
id: automated-deployment
---

Ideally an automated pipeline such as a github workflow should be put in place to *build, test and deploy* the Front End every time the master or develop branches are updated.

It can be configured to run automatically when something is merged into certain branches or even triggered manually.

<!-- TODO: add an example that's more suitable for external clients, this one is likely only useful to our internal client app devs -->

Here is an example of a github workflow which can trigger a deployment by the click of a button (running the action on github):

```yml
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: GHpages

# Manually triggered
on:
  workflow_dispatch:

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v2

      - name: Configure Node ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: https://npm.pkg.github.com/
          scope: '@genesislcap'
          
      - name: Bootstrap
        working-directory: ./client
        run: npm run bootstrap
        env:
          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}

      - name: Build
        working-directory: ./client/web
        run: npm run build
        env:
          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}

      - name: GitHub Pages action
          # You may pin to the exact commit or the version.
          # uses: peaceiris/actions-gh-pages@bbdfb200618d235585ad98e965f4aafc39b4c501
        uses: peaceiris/actions-gh-pages@v3.7.3
        with:
          publish_dir: ../client/web/dist
          github_token: ${{secrets.GITHUB_TOKEN}}
```
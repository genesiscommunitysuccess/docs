---
title: 'Integrations - Vue'
sidebar_label: 'Vue'
id: vue
keywords: [web, integrations, angular]
tags:
    - web
    - integrations
    - angular
---

Genesis Foundation works great with Vue. Let's take a look at how you can set up a Vue project, starting from scratch.

## Setting up the Vue project

First, you'll need to make sure that you have [Node.js](https://nodejs.org/) installed.

With Node.js installed, you can run the following command to install the Vue CLI:

```shell
npm install -g @vue/cli
```

With the CLI installed, you have access to the `vue` command-line interface. This can be used to create a new Vue project. For example, to create a new Vue App named "alpha-vue", you would use the following command:

```shell
vue create alpha-vue
```

When prompted to select options, choose **anually select features**. Follow the prompts, answering each question in turn. It is recommended that you select **TypeScript** when prompted.

When you have completed the prompts, you should have a basic runnable Vue application.

## Configuring packages

Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @genesislcap/alpha-design-system lodash-es
```

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm run serve`. The Vue CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

This code uses the Genesis Foundation Design System to register the `<alpha-card>` and `<alpha-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your  `components/HelloWorld.vue` file with the following markup:

```html
<template>
  <alpha-card>
    <h2>{{msg}}</h2>
    <alpha-button appearance="accent" v-on:click="onClick">Click Me</alpha-button>
  </alpha-card>
</template>
```

Replace your script tag with this:

```html
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    onClick: function () {
      console.log('clicked!');
    }
  }
}
</script>
```

To add a splash of style, replace the `style` tag with this:

```html
<style scoped>
  alpha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: var(--type-ramp-plus-5-font-size);
    line-height: var(--type-ramp-plus-5-line-height);
  }

  alpha-card > alpha-button {
    align-self: flex-end;
  }
</style>
```

Congratulations! You're now set up to use Genesis Foundation and Vue!
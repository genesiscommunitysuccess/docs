---
id: intro
sidebar_label: 'Introduction'
sidebar_position: 10
title: 'Introduction'
---

# Web Strategy

## Web Components

Web Components are custom html elements that completely encapsulate their logic to create self-contained reusable 
components, that won’t clash or interfere with the rest of application. They are future proof and interoperal with
traditional web frameworks.

## Genesis Foundation UI

Genesis Foundation UI is our frontend tech stack. Web Components are at the very core of our stragety here at Genesis.  

The Genesis Foundation UI is built on top of [Microsoft FAST](https://www.fast.design/docs/introduction/). The repo is
managed with [Lerna](https://github.com/lerna/lerna), see the lerna docs for more information.

Lerna (Monorepo manager)

FAST (Base web components)

Foundation (Our base web components)

Design Systems (Styling our base, multiple DS variants)

Micro Frontends (Composed small UI sections)

Custom CLI (Codegen)

WebPack Config (Apps, and module federation)

Rollup Config (Libs)

Showcase Apps (Foundation Explorer, FXP etc.)

App Shell

Communication System

CustomEvents

RxJS

FDC3

Layout Manager

Dynamic switching

Window/Panel layout participent

Testing (I’d like to use Playwright here, in-progress)

UNIT

E2E

Github

Repo hosting

Actions

Packages

etc.

```html live
<fast-button appearance="primary">Submit</fast-button>
```

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!../../examples/ui/helloWorld';

<CodeBlock className="language-ts">{Example}</CodeBlock>
---
id: creating-web-components
sidebar_label: Creating Web Components
sidebar_position: 30
title: Creating Web Components
tags:
  - web
  - frontend
  - ui
  - components
---
  
![masthead-fade](/img/web-components-board.png "Web Components Board")

For all the ways to create a web component see the
[webcomponents.dev board](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/board/). The board is
organised with the left-hand side being low-level, and the right-hand side being heavily abstracted by cli based
compilers.

## Extending the HTMLElement

To create a Web Component, you simply extend the native HTMLElement:

import CodeBlock from '@theme/CodeBlock';
import HtmlExample from '!!raw-loader!../../../../examples/ui/my-counter/htmlExample';

<CodeBlock className="language-ts">{HtmlExample}</CodeBlock>

As this is the base case, you'll notice this example sits on the top left of the board. However this is
very _verbose_, and is suboptimal in places. The styles are not shared across component instances. 
As such, many abstractions exist to make this more concise and provide additional benefits.

The same `<my-counter></my-counter>` Web Component has been written in 55 variants on the board for you to 
[compare](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/board/).

At Genesis, we’re building on top of Microsoft's [FAST](https://www.fast.design/) system, which offers several
packages, depending on your project needs. Fast Element is a lightweight means to easily build performant,
memory-efficient, standards-compliant Web Components. Fast Foundation is a library of Web Component classes, templates,
and other utilities built on Fast Element intended to be composed into registered Web Components.

Our Genesis packages are scoped to `@genesislcap`. These consist of:

- `@genesislcap/foundation-ui`
- `@genesislcap/foundation-zero`
- `@genesislcap/foundation-utils`
- `@genesislcap/foundation-comms`
- ...etc

Below is the same `<my-counter></my-counter>` Web Component written using our packages.

## Extending our FoundationElement

import GenesisExample from '!!raw-loader!../../../../examples/ui/my-counter/genesisExample';

<CodeBlock className="language-ts">{GenesisExample}</CodeBlock>

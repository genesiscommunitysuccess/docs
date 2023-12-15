---
title: 'Web components - overview'
sidebar_label: 'Overview'
id: overview
tags:
  - web
  - frontend
  - ui
  - browsers
  - support
---

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are at the very heart of our strategy - which is based on native browsers and a standards-based component model.

This eliminates a number of problems, such as deciding between Angular, React & Vue, dealing with version clashes & upgrades, or needing to onboard web-framework specialists.

Our Web Components are built on top of [Microsoft FAST](https://www.fast.design/docs/introduction/), which is a lightweight abstraction that enables you to build performant, memory-efficient, standards-compliant Web Components.

Our Genesis packages are scoped to `@genesislcap`. These consist of:

- `@genesislcap/foundation-ui`: Base components
- `@genesislcap/foundation-zero`: The zero design-system variant
- `@genesislcap/foundation-utils`: Utilities
- `@genesislcap/foundation-comms`: Comms system
- ...etc

## Browser support
Below is a list of browsers that provide native support for Web Components.

### Desktop
- Firefox (63+)
- Chrome (67+)
- Opera (64+)
- Edge (79+)
- IE11 (not out of the box, but partial support with polyfills is possible)
- Safari (10.1+ supports a number of web component features, but fewer than the above browsers)

### Mobile
- Android Browser (94+)
- Opera Mobile (64+)
- Chrome for Android (94+)
- Firefox for Android (92+)
- Samsung Internet (6.2+)

See [caniuse.com](https://caniuse.com/?search=web%20components) for more information.
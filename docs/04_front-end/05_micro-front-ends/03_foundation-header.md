---
title: 'Foundation Header'
sidebar_label: 'Foundation header'
Id: front-end-foundation-header
tags:
  - header
  - sidebar
  - frontend
  - ui
  - mf
  - web
  - micro frontends
---

import Setup from '../../../node_modules/@genesislcap/foundation-header/docs/setup.md'

# Foundation Header

API reference [can be found here.](../foundation-header_apiref/)

The Header micro front-end is a semi-batteries included component. It consists of a navigation bar and flyout menu, with routing and account logout capabilities.

You can customise:

- the icon shown on the navigation bar and flyout menu (this shows the Genesis logo by default).
- navigation links at the left-hand side of the navigation bar.
- the control buttons on the right-hand side of the navigation bar can be shown or hidden, and their behaviour controlled via event listeners
- The contents of the flyout menu.

Here is an example of the navigation bar with three navigation items, and all three control buttons shown.
![Header with the standard genesis logo](/img/foundation-header-standard.png)

This next example is the same as the previous example, except the Genesis logo is replaced with a custom icon.
![Header with a customised logo](/img/foundation-header-replaced-img.png)

In this next example, we have put a set of example options set in the flyout menu.
![The sidebar included with the header opened with some example content](/img/foundation-header-sidebar.png)

<Setup />


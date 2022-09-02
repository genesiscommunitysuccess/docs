---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
tags:
  - design system
  - frontend
  - ui
---

A design system is a collection of resources for interactive media that promotes brand alignment. Typically, it consists of the following:

* UX assets
* Design tokens
* Component libary
* Documentation

### UX assets

These are visual and interaction design prototypes created in tools like Axure, Sketch or Figma. They are implemented using a set of variables known as design tokens.

### Design tokens

A design token is a semantic, named variable used to describe a design system. They often describe design concepts like typography, colour, sizes, UI spacing, etc. They form the core of a brand's visual identity.

Design tokens are used throughout the UX assets and component library to ensure consistency.

### Component library
A component library is a set of reusable components and tools. 

Our component library makes extensive use of design tokens. You can create your own design system simply by modifying our existing tokens. You can also create your own tokens, both stand-alone and derived from existing tokens.

### Documentation site
Documentation site presents the different parts of a design system together alongside best-practice recommendations. Component documentation will often include live previews to showcase available configuration options.

## Hierarchy

Our design system implementation provides the elements listed above, as well as a few additional features. One of these is the ability for one design system to extend another. For example, a foundation/base design system can focus on functionality and provide components with minimal styling, while more specialised design systems can extend it and provide styling for a given target audience.

You are not restricted to a single design system within a project - it is possible to use multiple design systems within the same project (and even on the same page).

### Genesis Foundation UI

When you generate a design system using the [CLI](/getting-started/quick-start/create-a-new-project/) it will automatically extend a base design system that we have provided.

This highly configurable design system is called Genesis Foundation UI. It is made up of a set of web components and accompanying design tokens. The visual design can be impacted in myriad ways using the tokens, CSS, element templates and shadow DOM options as necessary for your application.

Like all the design systems built by the Genesis UX teams, our design system starts in [Axure](https://www.axure.com/) and has been lab-tested to meet the needs of financial markets.

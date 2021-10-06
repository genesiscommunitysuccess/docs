---
id: intro
sidebar_position: 10
title: Design System
sidebar_label: Introduction
tags:
  - design system
  - frontend
  - ui
---

## Structure

Design system is a collection of resources for interactive media that promotes brand alignment. Typically it consists of the following:

* UX assets
* Design tokens
* Component libary
* Documentation

### UX Assets

These are visual and interaction design prototypes created in tools like Axure, Sketch or Figma. They are implemented using a set of reference values also known as design tokens.

### Design tokens

Design tokens express design abstractions like colour, typography, spacing units, and other related values. They form the core of a brand's visual identity.

Design tokens are used throughout the UX assets and component library to ensure consistency.

### Component library
A component library is a set of reusable components and tools. 

Our component library makes an extensive use of design tokens. You can create your own design system simply by modifying our
existing tokens. You can also create your own tokens, both standalone and derived from existing tokens.

### Documentation site
Documentation site presents the different parts of a design system together alongside best practice recommendations. Component documentation will often include live previews to showcase available configuration options.

## Hierarchy

It is possible to have more than one design system in a project e.g. a light and a dark variant.

It is also possible for one design system to extend another. For example, a foundation design system can focus on functionality and provide components with minimal styling, while more specialised design systems can extend it and provide styling for a given target audience.

### Rapid

When you generate a design system using [CLI](/web-ui-reference/cli/) it will automatically extend a base design system that we have provided.

This highly configurable design system is called [Rapid](https://n42r49.axshare.com/#id=u42cgo&p=primitives&c=1). It's made up of a set of web components and accompanying design tokens. The visual design can be impacted in myriad ways using the tokens, CSS, element templates and shadow DOM options as necessary for your application.

Like all the design systems built by the Genesis UX teams, our design system starts in [Axure](https://www.axure.com/) and has been lab-tested to meet the needs of financial markets applications.
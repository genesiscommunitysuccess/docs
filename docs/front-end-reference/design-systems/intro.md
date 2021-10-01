---
id: intro
sidebar_position: 10
title: Introduction
tags:
  - design system
  - frontend
  - ui
---

## Design Systems

A Design System is a collection of resources for interactive media that promotes brand alignment. Typically it includes the following:

* Design Tokens
* Component Libary
* UX Kit
* Documentation site

FAST Frame ([`@microsoft/fast-components`](https://www.npmjs.com/package/@microsoft/fast-components)) is a highly configurable Design System composed of Web Components, Design Tokens, stylesheets, and styling tools. You can drop it into any app to start with a robust component library and an adaptive and accessible UI system immediately.

### Design Tokens

These are the foundation of the brand. The most common design tokens are the colors in the brand palette, the fonts or the scale sizes. Design Tokens are shared across Design Kits and Component Library for a cohesive experience.

Design Tokens are powerful tools that are used to express design abstractions like color, typography, spacing units, and other design-led values. FAST exposes powerful tools for creating and using Design Tokens for your Design System. Both FAST Frame and the Fluent UI Web Components leverage FAST's design tokens extensively. FAST Frame's use of design tokens is so extensive that you might be able to create your own design system simply by modifying the existing tokens. Of course, you can always create your own tokens and even base your tokens on compositions of existing tokens. 

Design tokens are used to express design abstractions like color, typography, spacing units, and
other design-led values. The Genesis LCNC Platform exposes powerful tools for creating and using design tokens for your Design System. 

Our Web Components use design tokens extensively. You can create your own design system simply by modifying our
existing tokens. Of course, you can always create your own tokens, and even base your tokens on compositions of existing
tokens.

### Component Library
A Component Library is a set of reusable components. It uses design tokens for 

### UX Kit
A UX Kit is a set of patterns or components created in design tools like Axure, Sketch or Figma. Everything follows the design rules and is built using the design tokens.

### Documentation
The Documentation site, also called Reference site, is a central piece in the Design System definition. It aggregates all previous elements like Design Tokens, Design Kit and Component library into a single explorable site. It adds rules and guidelines about when and why a pattern or component should be used or not.

Designers will find UI, UX and Content design rules and guidelines along side references to the Design Kit elements.

Developers will find development guidelines along side references to the components to use. Most of the time, you will find development "Playgrounds" where components can be experienced immediately. This is great for component adoption.

## Rapid UX

Genesis Foundation UI helps by providing a highly configurable design system that you can drop into any application.

Rapid is the name of our highly configurable design system. It's made up of a set of web components and accompanying design tokens. The visual design can be impacted in myriad ways using the exported design tokens, element templates and styles can be augmented or overridden, and shadow roots can be opened or closed as necessary for your application.


Like all the Design Systems built by the Genesis UX teams, our Design System starts in [Axure](https://www.axure.com/) and has been lab-tested to meet the needs of  financial markets applications.
[Rapid Design System](https://n42r49.axshare.com/#id=u42cgo&p=primitives&c=1) is our initial offering. You can use it straight from the box or you can customise it to your needs.


A Design System provides a collection of tokens that components can use to alter their appearance. However,
a Design System can augment component templating and / or their internal logic, too.


If you need more control than you can get through modifying design token values or recipes, you can wrap your styling around the foundation components. By exporting raw JavaScript Custom Element classes, `@genesislcap/foundation-ui` handles the business-logic driving a large catalog of UI components. These Custom Element classes can be taken as-is and composed with your templates and styles to match your application or library requirements, reducing the development time and overhead of creating your own design system. For example, rather than implementing a Tree View from scratch, you can use the Foundation Tree View class and simply compose it with your own CSS to create a reusable web component as part of your own system.


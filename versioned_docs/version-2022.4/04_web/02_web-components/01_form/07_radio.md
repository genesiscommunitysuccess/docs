---
title: 'Web Components - Radio'
sidebar_label: 'Radio'
id: radio
keywords: [web, web components, radio]
tags:
    - web
    - web components
    - radio
---

A selection input with support for selection of multiple options.

## Set-up

```ts
import { provideDesignSystem, alphaPicker } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaPicker());
```

## Usage

```html
<alpha-picker
    default-selection=""
    selection=""
    options="apples,oranges,bananas,pears,pineapples,strawberries"
    no-suggestions-text="No suggestions available"
    suggestions-available-text="Suggestions available"
    loading-text="Loading"
    label="Select some things"
></alpha-picker>
```

## Use cases

Selecting multiple options in the same input: You could have a set of broker codes, for example, and the user could select one or more of those codes.

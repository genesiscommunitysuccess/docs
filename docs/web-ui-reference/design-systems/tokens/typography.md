---
id: typography
title: Typography Tokens
sidebar_position: 20
sidebar_label: Typography
hide_table_of_contents: true
---

## Configuration

You can adjust any of the defaults in the `src/_config` folder of your design system.

## Body font

The base typeface for most of the components.

### Usage

```ts
import {bodyFont} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    font-family: ${bodyFont};
}`;
```

## Font sizes and line heights

### Usage

```ts
import {typeRampMinus1FontSize, typeRampMinus1LineHeight} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    font-size: ${typeRampMinus1FontSize};
    line-height: ${typeRampMinus1LineHeight};
}`;
```

#### Typography

| Level              | Font Size Token Name            | Line Height Token Name           |
|--------------------|---------------------------------|----------------------------------|
| Minus 2 (smallest) | `typeRampMinus2FontSize`        | `typeRampMinus2LineHeight`       |
| Minus 1            | `typeRampMinus1FontSize`        | `typeRampMinus1LineHeight`       |
| Base (body)        | `typeRampBaseFontSize`          | `typeRampBaseLineHeight`         |
| Plus 1             | `typeRampPlus1FontSize`         | `typeRampPlus1LineHeight`        |
| Plus 2             | `typeRampPlus2FontSize`         | `typeRampPlus2LineHeight`        |
| Plus 3             | `typeRampPlus3FontSize`         | `typeRampPlus3LineHeight`        |
| Plus 4             | `typeRampPlus4FontSize`         | `typeRampPlus4LineHeight`        |
| Plus 5             | `typeRampPlus5FontSize`         | `typeRampPlus5LineHeight`        |
| Plus 6 (largest)   | `typeRampPlus6FontSize`         | `typeRampPlus6LineHeight`        |
-------------------------------------------------

<dockit-fast-frame-typography-tokens></dockit-fast-frame-typography-tokens>

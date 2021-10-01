---
id: typography-tokens
title: Typography tokens
sidebar_position: 50
---


Contains a set of font sizes and line heights.

## Usage

```js preview-story
import {
  provideDesignSystem,
  typeRampBaseFontSize,
  typeRampBaseLineHeight,
  typeRampPlus5FontSize,
  typeRampPlus5LineHeight,
  typeRampPlus6FontSize,
  typeRampPlus6LineHeight,
} from '@genesislcap/alpha-design-system';
import { FASTElement, css, html } from '@microsoft/fast-element';

provideDesignSystem();

class TypographyTokensUsage extends FASTElement {
  static definition = {
    name: 'typography-tokens-usage',
    styles: css`
      h1 {
        font-size: ${typeRampPlus6FontSize};
        line-height: ${typeRampPlus6LineHeight};
      }
      h2 {
        font-size: ${typeRampPlus5FontSize};
        line-height: ${typeRampPlus5LineHeight};
      }
      p {
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
      }
    `,
    template: html`
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>
    `,
  };
}

FASTElement.define(TypographyTokensUsage);

export const usageStory = () => html`<typography-tokens-usage></typography-tokens-usage>`;
```

## Typography Tokens

```js story
export const demosStory = () => {
  return html`<dockit-fast-frame-typography-tokens></dockit-fast-frame-typography-tokens>`;
};
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

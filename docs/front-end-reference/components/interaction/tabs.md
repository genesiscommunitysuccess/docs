# tabs

_Tabs_ are a set of layered sections of content that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

## Setup

```ts
import { provideDesignSystem, alphaTabs, getTab, getTabPanel } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTabs(), getTab(), getTabPanel());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaAnchor, getTab, getTabPanel, getTabs } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAnchor(), getTab(), getTabPanel(), getTabs());

export const usageStory = () => html`
  <alpha-tabs activeid="entrees">
    <alpha-tab id="apps">Appetizers</alpha-tab>
    <alpha-tab id="entrees">Entrees</alpha-tab>
    <alpha-tab id="desserts">Desserts</alpha-tab>
    <alpha-tab-panel id="appsPanel">
      <ol>
        <li><alpha-anchor href="#" appearance="hypertext">Stuffed artichokes</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Bruschetta</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Oven-baked polenta</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Salami and Fig Crostini with Ricotta</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Rosemary-Potato Focaccia with Goat Cheese</alpha-anchor></li>
      </ol>
    </alpha-tab-panel>
    <alpha-tab-panel id="entreesPanel">
      <ol>
        <li><alpha-anchor href="#" appearance="hypertext">Mushroom-Sausage Ragù</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Tomato Bread Soup with Steamed Mussels</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Grilled Fish with Artichoke Caponata</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Celery Root and Mushroom Lasagna</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Osso Buco with Citrus Gremolata</alpha-anchor></li>
      </ol>
    </alpha-tab-panel>
    <alpha-tab-panel id="dessertsPanel">
      <ol>
        <li><alpha-anchor href="#" appearance="hypertext">Tiramisu</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Spumoni</alpha-anchor></li>
        <li><alpha-anchor href="#" appearance="hypertext">Limoncello and Ice Cream with Biscotti</alpha-anchor></li>
      </ol>
    </alpha-tab-panel>
  </alpha-tabs>
`;
```

## Use cases

- Steve is researching for an upcoming vacation for him and his family. He opens his web browser and opens a new tab to make a rental car reservation and another for his flight information. Steve can quickly switch back and fourth between tabs to get the information he needs for the rental car reservation.

- Monika visits a website to learn how to fix her leaky sink. The website displays a vertical tab interface with each step. Monika can jump ahead steps or go back to previous steps by selecting various tabs.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tabpanel)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tabs/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tabs/tabs.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/tabs/tabs.styles.ts)

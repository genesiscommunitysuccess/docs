import {attr, css, customElement, FoundationElement, html} from '@genesislcap/foundation-ui';

/**
 * Leverages Constructable Stylesheet Objects and ShadowRoot#adoptedStyleSheets
 * to efficiently re-use CSS across component instances.
 */
export const styles = css`
  * { font-size: 200%; }
  span {
    width: 4rem;
    display: inline-block;
    text-align: center;
  }
  button {
    width: 64px;
    height: 64px;
    border: none;
    border-radius: 10px;
    background-color: seagreen;
    color: white;
  }
`;

/**
 * Strongly typed template literal system, with event and data bindings etc.
 * Capable of high-performance rendering, and efficient, incremental batched updates.
 */
export const template = html<MyCounter>`
  <button @click="${x => x.subtract()}">-</button>
    <span>${x => x.count}</span>
  <button @click="${x => x.add()}">+</button>
`;

/**
 * Optionally use TypeScript decorators, or create a static
 * `definition` field on your class if you prefer.
 */
@customElement({
  name: 'my-counter',
  template,
  styles,
})
export class MyCounter extends FoundationElement {
  @attr count: number = 0;

  subtract() {
    this.count -= 1;
  }

  add() {
    this.count += 1;
  }
}

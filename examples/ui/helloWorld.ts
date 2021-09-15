import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('hello-world')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
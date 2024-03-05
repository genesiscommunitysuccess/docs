import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  displayFlyout = false;

  showFlyout() {
    this.displayFlyout = true;
  }

  hideFlyout() {
    this.displayFlyout = false;
  }
}

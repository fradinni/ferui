import { Component } from '@angular/core';

@Component({
  selector: 'components-landing',
  styleUrls: ['./components-demo.scss'],
  template: `
    <ul class="nav nav-pills mt-3">
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./default']">Components</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./widget']">Widget</a></li>
    </ul>
    <hr />
    <router-outlet></router-outlet>
  `,
})
export class ComponentsLandingComponent {}

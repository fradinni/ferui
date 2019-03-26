import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { WidgetComponent } from './widget/widget.component';
import { ComponentsLandingComponent } from './components-landing.component';
import { ModuleWithProviders } from '@angular/core';

const COMPONENETS_ROUTES: Routes = [
  {
    path: '',
    component: ComponentsLandingComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DefaultComponent },
      { path: 'widget', component: WidgetComponent },
    ],
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(COMPONENETS_ROUTES);

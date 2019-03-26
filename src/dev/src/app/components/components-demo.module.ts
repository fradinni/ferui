import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeruiModule } from '@ferui/components';
import { ROUTING } from '../components/components-demo.routing';
import { HighlightModule } from 'ngx-highlightjs';
import { ComponentsLandingComponent } from './components-landing.component';
import { DefaultComponent } from './default/default.component';
import { WidgetComponent } from './widget/widget.component';
import { DemoPageComponent } from '../utils/demo-page.component';
import { DemoComponent } from '../utils/demo.component';

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, ROUTING, HighlightModule],
  declarations: [DemoPageComponent, DemoComponent, ComponentsLandingComponent, DefaultComponent, WidgetComponent],
  exports: [DemoPageComponent, DemoComponent, ComponentsLandingComponent, DefaultComponent, WidgetComponent],
})
export class ComponentsDemoModule {}

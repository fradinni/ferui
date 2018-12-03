import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { ROUTING } from './forms-demo.routing';
import { InputsComponent } from './inputs/inputs.component';
import { FeruiModule } from '@ferui/components';
import { FormsLandingComponent } from './forms-landing.component';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, ROUTING, HighlightModule],
  declarations: [DefaultComponent, InputsComponent, FormsLandingComponent],
  exports: [DefaultComponent, InputsComponent]
})
export class FormsDemoModule {
}
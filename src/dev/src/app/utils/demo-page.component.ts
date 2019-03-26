import { AfterContentInit, AfterViewInit, Component, ContentChildren, Input, QueryList, ViewChild } from '@angular/core';
import { DemoComponent } from './demo.component';
import { NgForm } from '@angular/forms';
import { DemoComponentData } from './demo-component-data';

/**
 * Class:  Demo-page.component.ts
 *
 * Description:
 * ---------------------------------
 * This component is building a Demo Page, it takes a pageTitle as parameter
 * and contains a list of Demo Components.
 *
 * Example:
 * ---------------------------------
 * <demo-page pageTitle="Widget Component">
 *   <demo-component [componentData]="examples[0]"></demo-component>
 *   <demo-component [componentData]="examples[1]"></demo-component>
 * </demo-page>
 *
 */
@Component({
  selector: 'demo-page',
  template: `<h2 class="mt-2 mb-2">{{pageTitle}}</h2>
  <p class="mt-4">Filters :
    <button class="btn btn-sm btn-info" *ngIf="canDisable" (click)="setDisable()">Toggle Disabled ({{disabled ? 'true' : 'false'}})</button>
    <button class="btn btn-sm btn-info ml-2" (click)="toggleAllCodes()">Toggle all code</button>
    <button class="btn btn-sm btn-info ml-2" (click)="toggleAllResults()">Toggle all results</button>
    <button class="btn btn-sm btn-info ml-2" (click)="hideAllCodeAndResults()">Hide all codes and results</button>
  </p>
  <form #demoForm="ngForm">
    <demo-component *ngFor="let example of examples" [componentData]="example" [form]="demoForm" [demoComponents]="demoComponents"></demo-component>
    <div class="footer">
      <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
      <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
      <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
    </div>
  </form>`,
})
export class DemoPageComponent implements AfterContentInit {
  @Input() examples: Array<DemoComponentData>;
  @Input() pageTitle: string = 'Demo Page';
  @Input() disabled: boolean = false;
  @ViewChild('demoForm') form: NgForm;
  demoComponents: Array<DemoComponent> = [];
  canDisable: boolean = false;

  ngAfterContentInit() {
    this.canDisable =
      this.disabled === true ||
      this.demoComponents.find(cmp => {
        return cmp.canDisable;
      }) !== undefined;
  }

  toggleAllCodes() {
    this.demoComponents.forEach(cmp => {
      cmp.toggleCode();
    });
  }

  toggleAllResults() {
    this.demoComponents.forEach(cmp => {
      cmp.toggleResult();
    });
  }

  hideAllCodeAndResults() {
    this.demoComponents.forEach(cmp => {
      cmp.hideCodeAndResults();
    });
  }

  setDisable() {
    this.disabled = !this.disabled;
    this.demoComponents.forEach(cmp => {
      cmp.disable(this.disabled);
    });
  }

  validate(): void {
    this.form.form.markAsTouched();
    for (const controlKey in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlKey)) {
        this.form.controls[controlKey].markAsTouched();
        this.form.controls[controlKey].updateValueAndValidity();
      }
    }
  }
}

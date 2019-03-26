import { AfterViewInit, Compiler, Component, Input, NgModule, NgModuleFactory, OnInit, ViewChild } from '@angular/core';
import { FeruiModule } from '@ferui/components';
import { FormsModule, NgForm } from '@angular/forms';
import * as jsBeautify from 'js-beautify';
import { DemoComponentData } from './demo-component-data';
import { CommonModule } from '@angular/common';

/**
 * Class:  Demo.component.ts
 *
 * Description:
 * ---------------------------------
 * This class is building a Demo Component and takes a DemoComponentData object as parameter.
 *
 *
 * Example:
 * ---------------------------------
 * new DemoComponentData({
 *  title: 'Simple Widget',
 *  models: {one: 'one'},
 *  params: {value: 'value'},
 *  canDisable: true,
 *  source: `<fui-widget>
 *             <fui-widget-title>My title</fui-widget-title>
 *             <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
 *             <input fuiInput name="myField" [(ngModel)]="models.one" required />
 *             My value: {{params.value}}
 *           </fui-widget>`
 *  }));
 *
 *
 * The "#code" attribute:
 * ----------------------------------
 * If you want to only include a specific part of the source code in the source code preview area,
 * you can  use the "#code" attribute on one or multiple specific elements of your source code.
 * Only elements having this attribute will be displayed in Code section.
 * If this attribute is not used, the entire code will be displayed.
 *
 * new DemoComponentData({
 *  title: 'Simple Widget',
 *  ...
 *  source: `<fui-widget>
 *             <fui-widget-title>My title</fui-widget-title>
 *             <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
 *
 *             <div #code>  <!-- Only this element and his content will be displayed in code preview area -->
 *               <input fuiInput name="myField" [(ngModel)]="models.one" required />
 *               My value: {{params.value}}
 *             </div>
 *           </fui-widget>`
 *  }));
 */
@Component({
  selector: 'demo-component',
  styleUrls: ['./demo-component.scss'],
  host: {
    '[class.demo-component]': 'true',
  },
  template: `
    <fui-widget>
      <fui-widget-header class="demo-component-header bg-dark">
        <fui-widget-title><span class="text-white font-weight-normal">{{title}}</span></fui-widget-title>
        <fui-widget-actions>
          <clr-icon class="toggle-code-and-models" [attr.shape]="resultHidden && codeHidden ? 'eye'  : 'eye-hide'" (click)="resultHidden && codeHidden ? toggleCode() : hideCodeAndResults()"></clr-icon>
        </fui-widget-actions>
      </fui-widget-header>
      <fui-widget-body class="p-0">
        <!--  Code and models -->
        <div class="code-and-models" *ngIf="!codeHidden || !resultHidden">
          <ul class="nav nav-tabs">
            <li class="nav-item" (click)="showCode()">
              <a class="nav-link" [ngClass]="{active: !codeHidden}">Code</a>
            </li>
            <li class="nav-item" (click)="showResult()">
              <a class="nav-link" [ngClass]="{active: !resultHidden}">Results</a>
            </li>
          </ul>
          <div class="code-and-models-container">
            <pre *ngIf="!codeHidden" style="max-height: 250px"><code [highlight]="codeBlock"></code></pre>
            <pre *ngIf="!resultHidden"><code [highlight]="resultsData() | json"></code></pre>
          </div>
        </div>
        <!-- Separator -->
        <hr *ngIf="!codeHidden || !resultHidden">
        <!-- Component -->
        <div class="p-3">
          <ng-container *ngComponentOutlet="dynamicComponent; ngModuleFactory: dynamicModule;"></ng-container>
        </div>
      </fui-widget-body>
    </fui-widget>`,
})
export class DemoComponent implements OnInit, AfterViewInit {
  @Input() form: NgForm;
  @Input() componentData: DemoComponentData;
  @Input() demoComponents: Array<DemoComponent>;
  @Input() disabled: boolean = false;
  @Input() codeHidden: boolean = true;
  @Input() resultHidden: boolean = true;
  dynamicComponent: any;
  dynamicModule: NgModuleFactory<any>;
  childrenForms: Array<NgForm> = [];

  title: string;
  sourceCode: string;
  models: object;
  params: any;
  canDisable: boolean;
  codeBlock: string;

  constructor(private _compiler: Compiler) {}

  ngOnInit(): void {
    this.title = this.componentData.title;
    this.sourceCode = this.componentData.source;
    this.models = this.componentData.models;
    this.params = this.componentData.params;
    this.canDisable = this.componentData.canDisable;

    if (!this.params.disabled) {
      this.params.disabled = this.disabled;
    }

    const codeBlocks = this.extractCodeBlocks(this.sourceCode);
    this.codeBlock = jsBeautify.html(codeBlocks.length > 0 ? codeBlocks.join('') : this.sourceCode);

    this.dynamicComponent = this.createNewComponent(this.componentData, this.childrenForms);
    this.dynamicModule = this._compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));

    this.demoComponents.push(this);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.childrenForms.forEach(form => {
        // @ts-ignore
        form._directives.forEach(dir => {
          this.form.addControl(dir);
        });
      });
      // Trigger the updateValueAndValidity() method on parent form after adding controls.
      for (const controlKey in this.form.controls) {
        if (this.form.controls.hasOwnProperty(controlKey)) {
          this.form.controls[controlKey].updateValueAndValidity();
        }
      }
    });
  }

  resultsData() {
    const data: any = {};
    data.models = {};
    for (const modelName of Object.keys(this.models)) {
      data.models[modelName] = this.models[modelName];
    }
    if (this.params && Object.keys(this.params).length) {
      data.params = this.params;
      if (!this.canDisable) {
        delete this.params.disabled;
      }
    }
    return data;
  }

  concatResultModels(models): Array<any> {
    const results: Array<any> = [];
    for (const modelName of models) {
      results.push({
        'field-name': modelName,
        value: models[modelName],
      });
    }
    return results;
  }

  showCode() {
    this.resultHidden = true;
    this.codeHidden = false;
  }

  showResult() {
    this.codeHidden = true;
    this.resultHidden = false;
  }

  toggleCode() {
    this.codeHidden = !this.codeHidden;
    this.resultHidden = !this.codeHidden;
  }

  toggleResult() {
    this.resultHidden = !this.resultHidden;
    this.codeHidden = !this.resultHidden;
  }

  hideCodeAndResults() {
    this.resultHidden = true;
    this.codeHidden = true;
  }

  disable(disabled: boolean) {
    if (this.canDisable) {
      this.params.disabled = disabled;
    }
  }

  protected createComponentModule(componentType: any) {
    @NgModule({
      imports: [CommonModule, FormsModule, FeruiModule],
      declarations: [componentType],
      entryComponents: [componentType],
    })
    class RuntimeComponentModule {}
    return RuntimeComponentModule;
  }

  protected createNewComponent(example: DemoComponentData, childrenForms: Array<NgForm>) {
    example.source = '<form #dynamicForm="ngForm">' + example.source + '</form>';
    @Component({
      selector: 'dynamic-component',
      template: example.source,
    })
    class DynamicComponent implements OnInit {
      @ViewChild('dynamicForm') form: NgForm;
      public params = example.params;
      public models = example.models;

      ngOnInit(): void {
        childrenForms.push(this.form);
      }
    }
    return DynamicComponent;
  }

  /**
   * Extract from source code elements that have the #code attribute.
   * @param code Source code
   */
  private extractCodeBlocks(code: string) {
    const el = document.createElement('div');
    el.innerHTML = code;
    let codeBlocks = this.getAllElementsWithAttribute('#code', el);
    if (codeBlocks.length > 0) {
      codeBlocks = codeBlocks.map(block => block.outerHTML);
    }
    el.remove();
    return codeBlocks;
  }

  /**
   * Get HTML elements that have the specified attribute
   * @param attribute
   * @param html
   * @return Array[HtmlElement] Array of matching HTML elements
   */
  private getAllElementsWithAttribute(attribute: string, html: HTMLElement) {
    const matchingElements = [];
    const allElements = html.getElementsByTagName('*');
    for (let i = 0, n = allElements.length; i < n; i++) {
      if (allElements[i].getAttribute(attribute) !== null) {
        // Element exists with attribute. Add to array.
        matchingElements.push(allElements[i]);
      }
    }

    if (matchingElements.length > 0) {
      matchingElements.forEach(elm => elm.removeAttribute(attribute));
    }

    return matchingElements;
  }
}

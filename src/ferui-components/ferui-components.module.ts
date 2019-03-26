import { NgModule } from '@angular/core';
import { ClrIconModule } from './icon/icon.module';
import { FuiFormsModule } from './forms/forms.module';
import { FuiWidgetModule } from './widget/widget.module';

@NgModule({
  exports: [ClrIconModule, FuiFormsModule, FuiWidgetModule],
})
export class FeruiModule {}

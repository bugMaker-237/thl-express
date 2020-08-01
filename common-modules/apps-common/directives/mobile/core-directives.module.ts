import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgModule } from '@angular/core';
import { HideActionBarDirective } from './hide-actionbar.directive';

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [HideActionBarDirective],
  exports: [HideActionBarDirective, NativeScriptCommonModule],
  schemas: []
})
export class CoreDirectivesModule {}

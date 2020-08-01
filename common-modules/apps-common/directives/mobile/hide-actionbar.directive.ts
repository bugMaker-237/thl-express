import { Directive, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Directive({
  selector: '[hideActionBar]'
})
export class HideActionBarDirective implements OnInit {
  constructor(private page: Page) {
    page.actionBarHidden = true;
    page.backgroundSpanUnderStatusBar = true;
  }
  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'pressing-list',
  moduleId: module.id,
  template: `
    <page-router-outlet hideActionBar></page-router-outlet>
  `
})
export class HistoryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

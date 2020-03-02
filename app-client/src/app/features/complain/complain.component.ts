import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'complain',
  templateUrl: 'complain.component.html',
  styleUrls: ['complain.component.scss']
})
export class ComplainComponent implements OnInit {
  isFragment: boolean;
  complain: any = {};
  formDisabled = false;
  constructor(private _route: ActivatedRoute) {}
  ngOnInit() {
    this._route.data.subscribe((data: { isFragment: boolean }) => {
      this.isFragment = data.isFragment;
    });
  }
  onReturnPress(event) {}
}

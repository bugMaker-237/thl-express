import { ChangeDetectorRef } from '@angular/core';

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { GenericSubjects } from '@apps.common/services';
import { Subject } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';
@Component({
  selector: 'nav-bar',
  moduleId: module.id,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, AfterViewInit {
  drawerSubject: Subject<boolean>;
  canGoBack: boolean = false;
  @Input()
  text: string;
  @Input()
  showDrawerButton: boolean;
  constructor(
    private _genSubjects: GenericSubjects,
    private _router: RouterExtensions,
    private _changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.canGoBack = this._router.canGoBack();
    this._changeDetector.detectChanges();
  }
  ngAfterViewInit() {
    this.drawerSubject = this._genSubjects.get<boolean>('demandDrawer$', true);
  }
  openDrawer() {
    this.drawerSubject.next(true);
  }
  goBack() {
    this._router.back();
  }
}

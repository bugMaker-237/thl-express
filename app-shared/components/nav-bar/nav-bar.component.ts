import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import { GenericSubjects } from '@apps.common/services';
import { Subject } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'nav-bar',
  moduleId: module.id,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements AfterViewInit {
  drawerSubject: Subject<boolean>;
  @Input() text: string;
  @Input() showDrawerButton: boolean;
  constructor(
    private _genSubjects: GenericSubjects,
    private _router: RouterExtensions
  ) {}

  ngAfterViewInit() {
    this.drawerSubject = this._genSubjects.get<boolean>('demandDrawer$', true);
  }
  canGoBack() {
    return this._router.canGoBack();
  }

  openDrawer() {
    this.drawerSubject.next(true);
  }
  goBack() {
    this._router.back();
  }
}

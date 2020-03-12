import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { IUser } from '@app.shared/models';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { GenericSubjects } from '@apps.common/services';
import { RouterExtensions } from 'nativescript-angular/router';
import { AuthService } from '../../services';
// import { AuthService } from '@app.shared/services';
@Component({
  selector: 'app-shell',
  moduleId: module.id,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements AfterViewInit, OnInit {
  public user: IUser = {
    image: '',
    name: '',
    username: ''
  } as any;
  public menus = [
    {
      name: 'Profile',
      icon: 'person',
      link: '/app-shell/profil'
    },
    {
      name: 'Service VIP',
      icon: 'directions_bike',
      link: '/app-shell/map/VIP'
    },
    {
      name: 'Service Independant',
      icon: 'directions_bike',
      link: '/app-shell/map/INDEPENDANT'
    },
    {
      name: 'Service Colis',
      icon: 'local_shipping',
      link: '/app-shell/packet'
    },
    {
      name: 'Pressing',
      icon: 'local_laundry_service',
      link: '/app-shell/pressing'
    },
    {
      name: 'Historique courses',
      icon: 'history',
      link: '/app-shell/history/JOURNEY'
    },
    {
      name: 'Historique pressing',
      icon: 'history',
      link: '/app-shell/history/PRESSING'
    },
    {
      name: 'Se plaindre',
      icon: 'error_outline',
      link: '/app-shell/complain'
    },
    {
      name: 'Déconnexion',
      icon: 'exit_to_app',
      link: '#action'
    }
  ];

  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _genSubjects: GenericSubjects,
    private _router: RouterExtensions,
    private _authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
    this.user = this._authService.connectedUser;
    this._changeDetectionRef.detectChanges();
  }

  ngOnInit(): void {
    this._genSubjects
      .get('demandDrawer$', true)
      .subscribe(this.toggleDrawer.bind(this));
  }

  toggleDrawer(toogleDrawer: boolean) {
    toogleDrawer ? this.drawer.showDrawer() : this.drawer.closeDrawer();
  }
  openPage(event) {
    const m = this.menus[event.index];
    this.toggleDrawer(false);
    if (m.link === '#action') {
      this._authService.signOut().subscribe({
        next: () =>
          this._router.navigate(['auth/sign-in'], {
            transition: {
              name: 'slide'
            },
            clearHistory: true
          })
      });
    } else {
      this._router.navigate([m.link], {
        transition: {
          name: 'slide'
        },
        clearHistory: event.index === 0
      });
    }
  }
}

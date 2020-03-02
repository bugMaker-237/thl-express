import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { UserRequest, IUser } from '@app.shared/models';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { GenericSubjects } from '@apps.common/services';
import { RouterExtensions } from 'nativescript-angular/router';
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
  };
  public menus = [
    {
      name: 'Accueil',
      icon: 'home',
      link: '/app-shell/home'
    },
    {
      name: 'Profile',
      icon: 'person',
      link: '/app-shell/profil'
    },
    {
      name: 'Pressing',
      icon: 'domain',
      link: '/app-shell/pressing'
    },
    {
      name: 'Historique',
      icon: 'history',
      link: '/app-shell/history'
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
    private _router: RouterExtensions
  ) {}

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
    this.user = {
      name: 'Etienne Yamsi',
      image: 'https://etienneyamsi.com/images/jn-pp.png',
      username: 'bugmaker',
      email: 'yamsietienne@gmail.com',
      token: 'token'
    };
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
    this._router.navigate([m.link], {
      transition: {
        name: 'slide'
      },
      clearHistory: event.index === 0
    });
  }
}

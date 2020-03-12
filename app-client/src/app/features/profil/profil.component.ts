import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { IUser } from '@app.shared/models';
@Component({
  selector: 'profil',
  moduleId: module.id,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: IUser = {
    email: '',
    image: '',
    name: '',
    username: ''
  } as any;
  formDisabled = false;
  viewPassword = false;
  constructor(private page: Page) {}

  ngOnInit(): void {
    this.user = {
      name: 'Etienne Yamsi',
      image: 'https://etienneyamsi.com/images/jn-pp.png',
      email: 'yamsietienne@gmail.com',
      token: 'token'
    } as any;
  }
  onReturnPress(event) {}
}

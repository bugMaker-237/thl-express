import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import { IUser } from '@app.shared/models';
import { ProfilService } from './profil.service';
import { ToastService } from '@apps.common/services';
@Component({
  selector: 'profil',
  moduleId: module.id,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [ProfilService]
})
export class ProfilComponent implements OnInit {
  user: IUser = {} as any;
  userToUpdate: any = {};
  formDisabled = false;
  toComplete: string;
  constructor(
    private _authService: AuthService,
    private _profilService: ProfilService,
    private _toasService: ToastService
  ) {}

  ngOnInit(): void {
    this.user = this._authService.connectedUser;
    this.userToUpdate = {
      name: this.user.name
    };
  }
  update() {
    this._profilService.updateProfil(this.userToUpdate).subscribe({
      next: (res: IUser) => {
        this.user = res;
        this.userToUpdate.name = this.user.name;
        this._toasService.push({
          text: 'Enregistrement effectué!',
          data: {
            backgroundColor: 'primary'
          }
        });
        this._authService.setUserInfos(
          this.user.name,
          this.user.phone,
          this.user.email
        );
      }
    });
  }
}

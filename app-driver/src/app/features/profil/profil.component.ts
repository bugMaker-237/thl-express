import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import { IUser } from '@app.shared/models';
import { ProfilService } from './profil.service';
import { ToastService, Loader } from '@apps.common/services';
import { RadImagepicker } from '@nstudio/nativescript-rad-imagepicker';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
@Component({
  selector: 'profil',
  moduleId: module.id,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [ProfilService],
})
export class ProfilComponent implements OnInit {
  user = {} as any;
  userToUpdate: any = {};
  formDisabled = false;
  toComplete: string;
  selectedImage: ImageSource;
  imageSelected: boolean;

  constructor(
    private _authService: AuthService,
    private _profilService: ProfilService,
    private _toasService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this._authService.connectedUser;
    this.userToUpdate = {
      name: this.user.name,
    };
    console.log(this.user);
    this.selectedImage = await ImageSource.fromAsset(
      new ImageAsset('~/assets/camera.png')
    );
  }
  public async startSelection() {
    const radImagepicker = new RadImagepicker();
    this.selectedImage = (
      await radImagepicker.pick({
        imageLimit: 1,
      })
    )[0];
    this.imageSelected = !!this.selectedImage;
  }
  async update() {
    Loader.default.show();
    if (this.imageSelected) {
      this.userToUpdate.picture = await this.getPicture();
    }
    Loader.default.hide();

    this._profilService.updateProfil(this.userToUpdate).subscribe({
      next: (res: IUser) => {
        this.user = res;
        this.userToUpdate.name = this.user.name;
        this._toasService.push({
          text: 'Enregistrement effectué!',
          data: {
            backgroundColor: 'primary',
          },
        });
        this._authService.setUserInfos(
          this.user.name,
          this.user.phone,
          this.user.email
        );
      },
    });
  }
  async getPicture(): Promise<Blob> {
    return new Promise((res, rej) => {
      res(
        new Blob([this.selectedImage.toBase64String('jpeg', 90)], {
          type: 'image/jpeg',
        })
      );
    });
  }
}

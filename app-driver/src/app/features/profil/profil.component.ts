import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import { IUser } from '@app.shared/models';
import { ProfilService } from '@app.shared/services';
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
    console.log(this._authService.connectedUser);
    const { token, ...user } = this._authService.connectedUser as any;
    user.driver = user.driver || {};
    this.userToUpdate = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      cni: user.driver.id_number,
      driving: user.driver.licence_id,
      experience: user.driver.experience,
    };
    console.log(user.driver.picture);
    this.selectedImage = !user.driver.picture
      ? await ImageSource.fromAsset(new ImageAsset('~/assets/camera.png'))
      : await ImageSource.fromUrl(
          this._authService.getFullUrl(user.driver.picture)
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

    this._profilService.updateDriverProfil(this.userToUpdate).subscribe({
      next: (res: IUser) => {
        this._toasService.push({
          text: 'Enregistrement effectué!',
          data: {
            backgroundColor: 'primary',
          },
        });
        this._authService.setUserInfos(this.userToUpdate);
      },
    });
  }
  async getPicture(): Promise<string> {
    return new Promise((res, rej) => {
      res(this.selectedImage.toBase64String('jpeg', 20));
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import { IUser } from '@app.shared/models';
import { ProfilService } from '@app.shared/services';
import { ToastService, Loader } from '@apps.common/services';
import { RadImagepicker } from '@nstudio/nativescript-rad-imagepicker';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageItem } from '@app.shared/models/image-item';
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
    // console.log(this._authService.connectedUser);
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

    if (user.image) {
      const img = new ImageItem(this._authService.getFullUrl(user.image));
      img.imageLoadCompleted = (imgSrc) => {
        this.selectedImage = imgSrc;
      };
      this.selectedImage = img.imageSrc;
    } else {
      this.selectedImage = await ImageSource.fromAsset(
        new ImageAsset('~/assets/camera.png')
      );
    }
  }
  public async startSelection() {
    const radImagepicker = new RadImagepicker();
    Loader.default.show();
    this.selectedImage = (
      await radImagepicker.pick({
        imageLimit: 1,
      })
    )[0];
    this.imageSelected = !!this.selectedImage;
    Loader.default.hide();
  }
  async update() {
    Loader.default.show();
    if (this.imageSelected) {
      this.userToUpdate.photo = await this.getPicture();
      // console.log(this.userToUpdate.photo);
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
      res(this.selectedImage.toBase64String('jpg', 20));
    });
  }
}

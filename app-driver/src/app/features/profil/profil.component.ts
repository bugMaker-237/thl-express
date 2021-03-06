import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import { IUser } from '@app.shared/models';
import { ProfilService } from '@app.shared/services';
import { ToastService, Loader } from '@apps.common/services';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { create } from 'nativescript-imagepicker';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageItem } from '@app.shared/models/image-item';
import { TranslateService } from '@ngx-translate/core';
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
  isEnglish: boolean;

  constructor(
    private _authService: AuthService,
    private _profilService: ProfilService,
    private _toasService: ToastService,
    private _translateService: TranslateService
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

    this.isEnglish = user.lang === 'en';

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
  langChanged() {
    this.isEnglish = !this.isEnglish;
    this._translateService.use(this.isEnglish ? 'en' : 'fr');
  }
  public async startSelection() {
    const context = create({
      mode: 'single',
    });

    await context.authorize();
    const imageAssets = await context.present();

    if (imageAssets && imageAssets.length > 0) {
      this.selectedImage = await ImageSource.fromAsset(imageAssets[0]);
      this.imageSelected = !!this.selectedImage;
    }
  }
  async update() {
    if (this.imageSelected) {
      this.userToUpdate.photo = await this.getPicture();
      // console.log(this.userToUpdate.photo);
    }
    this.userToUpdate.lang = this.isEnglish ? 'en' : 'fr';

    this._profilService.updateDriverProfil(this.userToUpdate).subscribe({
      next: (res: IUser) => {
        this._translateService.get('Messages.Common.Saved').subscribe({
          next: (msg) =>
            this._toasService.push({
              text: msg,
              data: {
                backgroundColor: 'primary',
              },
            }),
        });
      },
    });
  }
  async getPicture(): Promise<string> {
    return new Promise((res, rej) => {
      res(this.selectedImage.toBase64String('jpg', 20));
    });
  }
}

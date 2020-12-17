import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { AuthService } from '@app.shared/services';
import { create } from 'nativescript-imagepicker';
import { ImageSource } from 'tns-core-modules/image-source';
import { Image } from 'tns-core-modules/ui/image';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ToastService, Loader } from '@apps.common/services';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentsService],
})
export class DocumentsComponent implements OnInit {
  id: {
    front: ImageSource;
    back: ImageSource;
  } = {} as any;
  license: {
    front: ImageSource;
    back: ImageSource;
  } = {} as any;
  idDirty = 0;
  licDirty = 0;
  constructor(
    private _docsService: DocumentsService,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _translateService: TranslateService
  ) {}

  async ngOnInit() {
    Loader.default.show();
    const { driver } = this._authService.connectedUser;
    this.id.front = await this.getImage(driver.id_face, 'front');
    this.id.back = await this.getImage(driver.id_back, 'back');
    this.license.back = await this.getImage(driver.licence_back, 'back');
    this.license.front = await this.getImage(driver.licence_face, 'front');
    Loader.default.hide();
  }

  private async getImage(imagePath: string = null, side: 'front' | 'back') {
    return !!imagePath
      ? await ImageSource.fromUrl(this._authService.getFullUrl(imagePath))
      : await ImageSource.fromAsset(
          new ImageAsset(`~/assets/id-placeholder-${side}.png`)
        );
  }
  public async setImage(type: 'id' | 'license', side: 'front' | 'back') {
    if (type === 'id') {
      const img = await this.startSelection();
      this.id[side] = img;
      this.idDirty++;
    } else if (type === 'license') {
      const img = await this.startSelection();
      this.license[side] = img;
      this.licDirty++;
    }
  }

  public async save(type: 'id' | 'license') {
    const next = {
      next: () => {
        this._translateService.get('Messages.Common.Saved').subscribe({
          next: (msg) =>
            this._toastService.push({
              text: msg,
              data: {
                backgroundColor: 'primary',
              },
            }),
        });
      },
    };
    if (type === 'id' && this.idDirty >= 1) {
      this._docsService
        .updateID({
          face: this.id.front.toBase64String('jpg', 20),
          back: this.id.back.toBase64String('jpg', 20),
        })
        .subscribe(next);
    } else if (type === 'license' && this.licDirty >= 1) {
      this._docsService
        .updateLicense({
          face: this.license.front.toBase64String('jpg', 20),
          back: this.license.back.toBase64String('jpg', 20),
        })
        .subscribe(next);
    }
  }

  public async startSelection() {
    const context = create({
      mode: 'single',
    });

    await context.authorize();
    const imageAssets = await context.present();

    if (imageAssets && imageAssets.length > 0) {
      return await ImageSource.fromAsset(imageAssets[0]);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { AuthService } from '@app.shared/services';
import { RadImagepicker } from '@nstudio/nativescript-rad-imagepicker';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';

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
  constructor(
    private _docsService: DocumentsService,
    private _authService: AuthService
  ) {}

  async ngOnInit() {
    const { driver } = this._authService.connectedUser;
    this.id.front = await this.getImage(driver.id_face, 'front');
    this.id.back = await this.getImage(driver.id_back, 'back');
    this.license.back = await this.getImage(driver.licence_back, 'back');
    this.license.front = await this.getImage(driver.licence_face, 'front');
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
    } else if (type === 'license') {
      const img = await this.startSelection();
      this.license[side] = img;
    }
  }

  public async startSelection() {
    const radImagepicker = new RadImagepicker();
    return (
      await radImagepicker.pick({
        imageLimit: 1,
      })
    )[0];
  }
}

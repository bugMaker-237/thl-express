import { Observable } from 'tns-core-modules/data/observable';
import { Cache } from 'tns-core-modules/ui/image-cache';
import { ImageSource } from 'tns-core-modules/image-source';

import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';

const cache = new Cache();
cache.maxRequests = 100;
const loadPlaceHolder = async () =>
  (cache.placeholder = await ImageSource.fromAsset(
    new ImageAsset('~/assets/avatar.jpg')
  ));
loadPlaceHolder();
export class ImageItem extends Observable {
  private _imageSrc: string;
  imageLoadCompleted: (imgSrc: ImageSource) => void;
  get imageSrc(): ImageSource {
    const image = cache.get(this._imageSrc);

    if (image) {
      return image;
    }

    cache.push({
      key: this._imageSrc,
      url: this._imageSrc,
      completed: (img) => {
        this.notify({
          object: this,
          eventName: Observable.propertyChangeEvent,
          propertyName: 'imageSrc',
          value: img,
        });
        if (this.imageLoadCompleted) {
          this.imageLoadCompleted(img);
        }
      },
    });

    return cache.placeholder;
  }

  constructor(imageSrc: string) {
    super();
    this._imageSrc = imageSrc;
  }

  async loadPlaceholder(placeholder: string) {
    cache.placeholder = await ImageSource.fromAsset(
      new ImageAsset(placeholder)
    );
  }
}

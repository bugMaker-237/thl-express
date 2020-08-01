import { Injectable } from '@angular/core';
import * as platformModule from 'tns-core-modules/platform';
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private infos: string;
  constructor() {}

  public get device(): platformModule.Device {
    return platformModule.device;
  }

  public get screen(): platformModule.ScreenMetrics {
    return platformModule.screen.mainScreen;
  }

  public get isAndroid(): boolean {
    return platformModule.isAndroid;
  }

  public get isIOS(): boolean {
    return platformModule.isIOS;
  }

  public getAllDeviceInfo(): string {
    if (this.infos) {
      return this.infos;
    }

    this.appendToInfos(`Running on Android? ${platformModule.isAndroid}`);
    this.appendToInfos(`Running on iOS? ${platformModule.isIOS}`);

    this.appendToInfos(`device.model ${platformModule.device.model}`); // For example: "Nexus 5" or "iPhone".
    this.appendToInfos(`device.deviceType ${platformModule.device.deviceType}`); // "Phone" | "Tablet"
    this.appendToInfos(`device.os ${platformModule.device.os}`); // For example: "Android" or "iOS".
    this.appendToInfos(`device.osVersion ${platformModule.device.osVersion}`); // For example: 4.4.4(android), 8.1(ios)
    this.appendToInfos(`device.sdkVersion ${platformModule.device.sdkVersion}`); //  For example: 19(android), 8.1(ios).
    this.appendToInfos(`device.language ${platformModule.device.language}`); // For example "en" or "en-US".
    this.appendToInfos(
      `device.manufacturer ${platformModule.device.manufacturer}`
    ); // For example: "Apple" or "HTC" or "Samsung".
    this.appendToInfos(`device.uuid ${platformModule.device.uuid}`); // The unique identification number
    this.appendToInfos(`device.region ${platformModule.device.region}`); //  For example "US".

    this.appendToInfos(
      `screen.mainScreen.heightDIPs ${platformModule.screen.mainScreen.heightDIPs}`
    ); // The absolute height of the screen in density independent pixels.
    this.appendToInfos(
      `screen.mainScreen.heightPixels ${platformModule.screen.mainScreen.heightPixels}`
    ); // The absolute height of the screen in pixels.
    this.appendToInfos(
      `screen.mainScreen.scale ${platformModule.screen.mainScreen.scale}`
    ); // The logical density of the display.
    this.appendToInfos(
      `screen.mainScreen.widthDIPs ${platformModule.screen.mainScreen.widthDIPs}`
    ); // The absolute width of the screen in density independent pixels.
    this.appendToInfos(
      `screen.mainScreen.widthPixels ${platformModule.screen.mainScreen.widthPixels}`
    ); // The absolute width of the screen in pixel
    return this.infos;
  }
  appendToInfos(arg: string) {
    this.infos = (this.infos || '') + (arg + '\n');
  }
}

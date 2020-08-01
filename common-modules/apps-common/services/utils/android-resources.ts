import { getNativeApplication } from 'tns-core-modules/application/application';
import { ad } from 'tns-core-modules/utils/utils';

export function getStringResource(id: string) {
  return getNativeApplication()
    .getApplicationContext()
    .getString(ad.resources.getStringId('nativescript_google_maps_api_key'));
}

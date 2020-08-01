import {
  PLACES_API_URL,
  PLACES_DETAILS_API_URL_places
} from './google-maps-static';
import { IPlace, IPlacePredilection } from '@root/models/google/maps/places';
import { GoogleService } from '../google.service';

export class GooglePlaces extends GoogleService {
  constructor(key: string) {
    super(key);
  }
  public async search(
    terms: string,
    countryISO: string = '',
    types: string = ''
  ): Promise<IPlacePredilection[]> {
    const requestUrl = `${PLACES_API_URL}?input=${encodeURIComponent(
      terms.trim()
    )}${
      countryISO ? '&components=country:' + countryISO : ''
    }&types=${types}&key=${this.apikey}`;
    const data = await (await fetch(requestUrl)).json();
    this.throwIfError(data, () => data.predictions === undefined);
    return data.predictions.map((p: { description: any; place_id: any }) => ({
      description: p.description,
      placeId: p.place_id,
      data: p
    })) as IPlacePredilection[];
  }
  public async getPlaceById(placeId: any): Promise<IPlace> {
    const requestUrl = `${PLACES_DETAILS_API_URL_places}?placeid=${placeId}&key=${this.apikey}`;
    const data = await (await fetch(requestUrl)).json();
    this.throwIfError(data, () => data.result === undefined);
    return {
      latitude: data.result.geometry.location.lat,
      longitude: data.result.geometry.location.lng,
      name: data.result.name,
      phoneNumber: data.result.international_phone_number,
      formattedAddress: data.result.formatted_address,
      data: data,
      photoReference:
        data.result.photos && data.result.photos.length > 0
          ? data.result.photos[0].photo_reference
          : ''
    } as IPlace;
  }
}

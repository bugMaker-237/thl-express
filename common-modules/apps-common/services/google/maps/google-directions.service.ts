import { DIRECTION_API_URL } from './google-maps-static';
import { GoogleService } from '../google.service';
import { IPlace } from '@root/models';
import { IPosition } from '@root/models';
import { IMapRoute } from '@root/models';
import { Polyline } from './google-polyline';

export class GoogleDirections extends GoogleService {
  constructor(key: string) {
    super(key);
  }

  public async getDirections(
    origin: IPosition,
    destination: IPosition,
    sensor = true,
    travelMode = 'DRIVING'
  ): Promise<IMapRoute[]> {
    const requestUrl = `${DIRECTION_API_URL}?origin=${this.stringifyCoordinates(
      origin
    )}&destination=${this.stringifyCoordinates(
      destination
    )}&sensor=${sensor}&travelMode=${travelMode}&key=${this.apikey}`;

    const raw = await fetch(requestUrl);
    const data = (await raw.json()) || {};

    return (data.routes || []).map(
      (r) =>
        ({
          summary: r.summary,
          bounds: r.bounds,
          distance: r.legs[0].distance,
          duration: r.legs[0].duration,
          polyline: Polyline.decode(r.overview_polyline.points).map(
            (p) => ({ latitude: p[0], longitude: p[1] } as IPosition)
          ),
        } as IMapRoute)
    );
  }
}

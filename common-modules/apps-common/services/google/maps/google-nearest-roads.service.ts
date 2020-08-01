import { NEAREST_ROADS_API_URL } from './google-maps-static';
import { GoogleService } from '../google.service';
import { IPlace, ISnappedPoint, IPosition } from '@root/models';

export class GoogleNearestRoads extends GoogleService {
  constructor(key: string) {
    super(key);
  }

  public async getNearestRoads(
    ...points: IPosition[]
  ): Promise<ISnappedPoint[]> {
    const requestUrl = `${NEAREST_ROADS_API_URL}?points=${points
      .map(this.stringifyCoordinates)
      .join('|')}&key=${this.apikey}`;

    const raw = await fetch(requestUrl);
    const data = await raw.json();

    return data.snappedPoints.map(
      r =>
        ({
          position: r.location,
          originalIndex: r.originalIndex,
          placeId: r.placeId
        } as ISnappedPoint)
    );
  }
}

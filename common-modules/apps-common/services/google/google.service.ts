export abstract class GoogleService {
  constructor(protected apikey: string) {}

  throwIfError(data: any, condition: () => boolean) {
    if (condition()) {
      throw new Error(data.error_message);
    }
  }

  stringifyCoordinates(coordinate: { longitude: number; latitude: number }) {
    return `${coordinate.latitude},${coordinate.longitude}`.trim();
  }
}

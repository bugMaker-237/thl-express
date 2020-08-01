import {
  MapView,
  Polyline,
  Marker,
  Position,
} from 'nativescript-google-maps-sdk';
import { IMapRoute, IPosition } from '@apps.common/models';
import { Color } from 'tns-core-modules/color/color';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from 'tns-core-modules/image-source';

export function clearMap(mapView: MapView) {
  if (mapView) {
    mapView.removeAllMarkers();
    mapView.removeAllShapes();
  }
}
export function drawRoute(mapView: MapView, dirs: IMapRoute[]) {
  const lines: Polyline[] = [];
  dirs.forEach((r) => {
    const polyline = new Polyline();
    // const point = Position.positionFromLatLng(startPlace.latitude, startPlace.longitude);
    polyline.addPoints(
      r.polyline.map((p) =>
        Position.positionFromLatLng(p.latitude, p.longitude)
      )
    );
    polyline.visible = true;
    polyline.width = 20;
    polyline.color = new Color('#FFD300');
    polyline.geodesic = true;
    lines.push(polyline);
  });
  lines.forEach((l) => mapView.addPolyline(l));
}
export async function drawMarker(
  mapView: MapView,
  place: IPosition,
  index: number,
  title = '',
  userData = null,
  noImg = false
): Promise<Marker> {
  try {
    const marker = new Marker();
    marker.position = Position.positionFromLatLng(
      place.latitude,
      place.longitude
    );
    marker.title = title || (index === 0 ? 'Départ' : 'Arrivé');
    marker.snippet = place.name;

    if (!noImg) {
      const image: Image = new Image();
      let imgSrc: ImageSource;
      if (index === 1) {
        imgSrc = await ImageSource.fromFile('~/assets/finish.png');
      } else if (index === 0) {
        imgSrc = await ImageSource.fromFile('~/assets/arrived.png');
      } else {
        imgSrc = await ImageSource.fromFile('~/assets/bike.png');
      }
      image.imageSource = imgSrc;
      marker.icon = image;
    }
    marker.userData = userData;
    mapView.addMarker(marker);
    marker.showInfoWindow();
    return marker;
  } catch (e) {
    alert(e.message);
    return;
  }
  // this.mapView.
}

export function doZoom(mapView: MapView, padding = 20) {
  const builder = new (com.google
    .android as any).gms.maps.model.LatLngBounds.Builder();
  mapView.findMarker((marker) => {
    // // console.log(marker);
    builder.include(marker.android.getPosition());
    return false;
  });

  const bounds = builder.build();
  const cu = (com.google
    .android as any).gms.maps.CameraUpdateFactory.newLatLngBounds(
    bounds,
    padding
  );
  // // console.log(cu);
  mapView.gMap.animateCamera(cu);
}
